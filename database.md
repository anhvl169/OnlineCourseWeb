# Messaging Feature - Database Tables

## Overview
The messaging system enables real-time 1-on-1 and group conversations between users. It consists of three core tables that manage conversations, members, and messages.

---

## Table Structures

### 1. Conversations
**Mô tả:** Lưu trữ thông tin hội thoại (1-on-1 hoặc nhóm)

| Cột | Kiểu | Nullable | Default | Mô tả |
|-----|------|---------|---------|-------|
| id | INT | NO | IDENTITY(1,1) | Khóa chính, ID hội thoại |
| isGroup | BIT | YES | 0 | Loại hội thoại: 0 = 1-on-1, 1 = nhóm |
| createdAt | DATETIME | YES | GETDATE() | Ngày tạo hội thoại |

**Sử dụng:**
- Mỗi cuộc hội thoại (riêng tư hoặc nhóm) sẽ có một dòng
- `isGroup = 0`: Hội thoại riêng tư giữa 2 người
- `isGroup = 1`: Hội thoại nhóm với nhiều người

**Example:**
-- Hội thoại 1-on-1 INSERT INTO Conversations (isGroup) VALUES (0);
-- Hội thoại nhóm INSERT INTO Conversations (isGroup) VALUES (1);

---

### 2. ConversationMembers
**Mô tả:** Danh sách thành viên trong mỗi hội thoại

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| id | INT | NO | Khóa chính |
| conversationId | INT | NO | Khóa ngoại → Conversations (ON DELETE CASCADE) |
| userId | INT | NO | Khóa ngoại → Users (ON DELETE CASCADE) |
| lastReadAt | DATETIME | YES | Thời gian lần cuối đọc tin nhắn |

**Sử dụng:**
- Theo dõi thành viên của mỗi hội thoại
- Hỗ trợ tính năng "đã đọc" (read status)
- Cho 1-on-1: 2 dòng (1 cho mỗi user)
- Cho nhóm: N dòng (1 cho mỗi thành viên)

**Example:**
-- Thêm 2 user vào hội thoại (1-on-1) INSERT INTO ConversationMembers (conversationId, userId, lastReadAt) VALUES (1, 1, GETDATE()), (1, 2, GETDATE());
-- Cập nhật lần đọc cuối UPDATE ConversationMembers SET lastReadAt = GETDATE() WHERE conversationId = 1 AND userId = 1;

**Ưu điểm:**
- Dễ dàng xóa thành viên khỏi nhóm
- Theo dõi trạng thái đọc cho mỗi user
- Hỗ trợ nhóm có số lượng thành viên bất kỳ

---

### 3. Messages
**Mô tả:** Lưu trữ nội dung tin nhắn

| Cột | Kiểu | Nullable | Default | Mô tả |
|-----|------|---------|---------|-------|
| id | INT | NO | IDENTITY(1,1) | Khóa chính, ID tin nhắn |
| conversationId | INT | NO | - | Khóa ngoại → Conversations (ON DELETE CASCADE) |
| senderId | INT | NO | - | Khóa ngoại → Users (người gửi) |
| content | NVARCHAR(MAX) | NO | - | Nội dung tin nhắn |
| type | NVARCHAR(20) | YES | 'text' | Loại tin nhắn: 'text', 'image', 'file', etc. |
| createdAt | DATETIME | YES | GETDATE() | Thời gian gửi tin nhắn |

**Sử dụng:**
- Lưu tất cả tin nhắn từ mỗi thành viên
- Sắp xếp theo `createdAt` để hiển thị theo thứ tự thời gian
- Hỗ trợ nhiều loại nội dung

**Example:**
-- Gửi tin nhắn text INSERT INTO Messages (conversationId, senderId, content, type) VALUES (1, 1, 'Xin chào!', 'text');
-- Gửi tin nhắn hình ảnh INSERT INTO Messages (conversationId, senderId, content, type) VALUES (1, 2, '/images/photo.jpg', 'image');
-- Lấy tin nhắn của hội thoại theo thứ tự SELECT * FROM Messages WHERE conversationId = 1 ORDER BY createdAt DESC;

---

## Relationships & Indexes

### Foreign Keys
Conversations (1) ──→ (N) ConversationMembers ──→ (N) Users ↓ (1) ──→ (N) Messages ──→ (N) Users (as sender)

### Indexes
-- Chính (cho truy vấn tin nhắn) CREATE INDEX idx_conv_msg ON Messages(conversationId, createdAt DESC);
-- Phụ (tối ưu hóa hiệu suất) CREATE INDEX idx_conv_members ON ConversationMembers(conversationId); CREATE INDEX idx_user_messages ON Messages(senderId);

**Giải thích:**
- `idx_conv_msg`: Tìm kiếm tin nhắn theo hội thoại nhanh chóng (sắp xếp theo thời gian gần nhất)
- `idx_conv_members`: Tìm thành viên của hội thoại
- `idx_user_messages`: Tìm tin nhắn từ một user cụ thể

---

## Common Queries

### 1. Lấy danh sách hội thoại của user
SELECT c.id, c.isGroup, COUNT(cm.userId) AS member_count, MAX(m.createdAt) AS last_message_time FROM Conversations c JOIN ConversationMembers cm ON c.id = cm.conversationId LEFT JOIN Messages m ON c.id = m.conversationId WHERE cm.userId = @userId GROUP BY c.id, c.isGroup ORDER BY MAX(m.createdAt) DESC;

### 2. Lấy tin nhắn của hội thoại
SELECT m.id, m.conversationId, u.name AS sender_name, m.content, m.type, m.createdAt, CASE WHEN cm.lastReadAt >= m.createdAt THEN 'read' ELSE 'unread' END AS status FROM Messages m JOIN Users u ON m.senderId = u.user_id LEFT JOIN ConversationMembers cm ON m.conversationId = cm.conversationId AND cm.userId = @currentUserId WHERE m.conversationId = @conversationId ORDER BY m.createdAt DESC;

### 3. Kiểm tra tin nhắn chưa đọc
SELECT COUNT(*) AS unread_count FROM Messages m WHERE m.conversationId = @conversationId AND m.senderId != @currentUserId AND m.createdAt > ( SELECT lastReadAt FROM ConversationMembers WHERE conversationId = @conversationId AND userId = @currentUserId );

### 4. Xóa cuộc hội thoại (tự động xóa tin nhắn và thành viên)
DELETE FROM Conversations WHERE id = @conversationId; -- ConversationMembers và Messages sẽ tự động xóa (ON DELETE CASCADE)

---

## Data Flow

### Tạo 1-on-1 Conversation
1.	INSERT → Conversations (isGroup = 0)
2.	INSERT → ConversationMembers (User A)
3.	INSERT → ConversationMembers (User B)
4.	INSERT → Messages (Message content)

### Tạo Group Conversation
1.	INSERT → Conversations (isGroup = 1)
2.	INSERT → ConversationMembers (User 1)
3.	INSERT → ConversationMembers (User 2)
4.	INSERT → ConversationMembers (User N)
5.	INSERT → Messages (Message content)

---

## Best Practices

✅ **Nên làm:**
- Luôn ghi nhận `lastReadAt` khi user xem tin nhắn
- Sử dụng pagination khi lấy tin nhắn (limit + offset)
- Lọc tin nhắn theo `type` nếu cần phân loại
- Soft delete thay vì hard delete (thêm cột `deletedAt`)

❌ **Không nên làm:**
- Xóa `Conversations` trực tiếp (sẽ mất lịch sử)
- Truy vấn toàn bộ tin nhắn mà không `WHERE conversationId`
- Cập nhật `createdAt` sau khi tạo

---

## Statistics

**Tính toán:**
- Mỗi 1-on-1: 1 Conversations + 2 ConversationMembers + N Messages
- Mỗi Group (N user): 1 Conversations + N ConversationMembers + M Messages

**Example:** 
- 100 users → ~4,950 1-on-1 conversations
- 1 group (50 users) → 1 conversation + 50 members + N messages

---

**Ngày cập nhật:** 2026-03-26