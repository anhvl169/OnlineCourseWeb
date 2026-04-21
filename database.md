# OnlineCoursesDB - Database Documentation

## Overview
OnlineCoursesDB là một hệ thống quản lý khóa học trực tuyến với các tính năng mua hàng, quản lý người dùng, theo dõi tiến trình học tập và quản lý vai trò.

---

## Core Tables (Bảng Chính)

### 1. Users
**Mô tả:** Lưu trữ thông tin người dùng của hệ thống
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| user_id | INT | NO | Khóa chính, ID người dùng |
| name | NVARCHAR | YES | Tên người dùng |
| email | NVARCHAR | YES | Email (dùng để đăng nhập) |
| password | NVARCHAR | YES | Mật khẩu đã mã hóa |
| status | NVARCHAR | YES | Trạng thái (active/inactive) |
| google_id | NVARCHAR | YES | ID Google (nếu đăng nhập qua Google) |

---

### 2. Category
**Mô tả:** Phân loại các khóa học
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| category_id | INT | NO | Khóa chính |
| name | NVARCHAR | YES | Tên danh mục (VD: Lập trình, Thiết kế) |
| description | NVARCHAR | YES | Mô tả chi tiết danh mục |

---

### 3. Course
**Mô tả:** Lưu trữ thông tin chi tiết khóa học
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| course_id | INT | NO | Khóa chính |
| title | NVARCHAR | YES | Tên khóa học |
| description | NVARCHAR | YES | Mô tả khóa học |
| price | DECIMAL | YES | Giá khóa học (VND) |
| instructor_id | INT | YES | Khóa ngoại → Users (giáo viên) |
| status | NVARCHAR | YES | Trạng thái (active/inactive/draft) |
| category_id | INT | YES | Khóa ngoại → Category |
| imgUrl | NVARCHAR | YES | URL hình ảnh đại diện khóa học |

---

### 4. Lesson
**Mô tả:** Các bài học trong khóa học
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| lesson_id | INT | NO | Khóa chính |
| course_id | INT | YES | Khóa ngoại → Course |
| title | NVARCHAR | YES | Tên bài học |
| video_url | NVARCHAR | YES | URL video bài học |
| duration | INT | YES | Thời lượng bài học (phút) |
| status | NVARCHAR | YES | Trạng thái (active/inactive) |

---

## Transaction Tables (Bảng Giao Dịch)

### 5. Cart
**Mô tả:** Giỏ hàng người dùng
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| cart_id | INT | NO | Khóa chính |
| user_id | INT | YES | Khóa ngoại → Users |

---

### 6. Cart_Item
**Mô tả:** Các khóa học trong giỏ hàng
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| cart_item_id | INT | NO | Khóa chính |
| cart_id | INT | YES | Khóa ngoại → Cart |
| course_id | INT | YES | Khóa ngoại → Course |
| price | DECIMAL | YES | Giá khóa học tại thời điểm thêm vào |

---

### 7. Coupon
**Mô tả:** Mã giảm giá/phiếu giảm giá
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| coupon_id | INT | NO | Khóa chính |
| code | NVARCHAR | YES | Mã coupon (VD: SUMMER2024) |
| discount_type | NVARCHAR | YES | Loại giảm (PERCENTAGE/FIXED) |
| discount_value | DECIMAL | YES | Giá trị giảm (% hoặc VND) |
| max_discount | DECIMAL | YES | Giá trị giảm tối đa (VND) |
| min_order_value | DECIMAL | YES | Giá trị đơn hàng tối thiểu |
| start_date | DATETIME | YES | Ngày bắt đầu hiệu lực |
| end_date | DATETIME | YES | Ngày kết thúc hiệu lực |
| usage_limit | INT | YES | Số lần sử dụng tối đa |
| status | NVARCHAR | YES | Trạng thái (active/inactive) |

---

### 8. Invoice
**Mô tả:** Đơn hóa đơn (thanh toán)
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| invoice_id | INT | NO | Khóa chính |
| user_id | INT | YES | Khóa ngoại → Users |
| coupon_id | INT | YES | Khóa ngoại → Coupon |
| total_amount | DECIMAL | YES | Tổng giá gốc (VND) |
| discount_amount | DECIMAL | YES | Số tiền giảm (VND) |
| final_amount | DECIMAL | YES | Số tiền cuối cùng phải thanh toán |
| payment_method | NVARCHAR | YES | Phương thức thanh toán (Momo, Card, etc.) |
| payment_status | NVARCHAR | YES | Trạng thái (pending/success/failed) |
| created_at | DATETIME | YES | Ngày tạo hóa đơn (mặc định: GETDATE()) |
| order_id | INT | YES | ID giao dịch từ payment gateway (Momo) |
| updated_at | DATETIME | YES | Ngày cập nhật cuối (mặc định: GETDATE()) |

---

### 9. Invoice_Item
**Mô tả:** Chi tiết các khóa học trong hóa đơn
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| invoice_item_id | INT | NO | Khóa chính |
| invoice_id | INT | NO | Khóa ngoại → Invoice (ON DELETE CASCADE) |
| course_id | INT | NO | Khóa ngoại → Course |
| price | FLOAT | NO | Giá khóa học tại thời điểm mua |
| created_at | DATETIME | YES | Ngày tạo (mặc định: GETDATE()) |

---

## Learning Tracking Tables (Bảng Theo Dõi Học Tập)

### 10. Enrollment
**Mô tả:** Đăng ký khóa học (sau khi thanh toán)
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| enrollment_id | INT | NO | Khóa chính |
| user_id | INT | YES | Khóa ngoại → Users |
| course_id | INT | YES | Khóa ngoại → Course |
| purchase_date | DATETIME | YES | Ngày đăng ký/mua |
| progress | INT | YES | Tiến độ học (%): 0-100 |

---

### 11. Lesson_Process
**Mô tả:** Tiến độ học tập từng bài
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| process_id | INT | NO | Khóa chính |
| lesson_id | INT | NO | Khóa ngoại → Lesson |
| finished_date | DATETIME | YES | Ngày hoàn thành bài |
| process | INT | YES | Tiến độ bài học (%) |

---

### 12. Course_Process
**Mô tả:** Tiến độ học tập khóa học
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| process_id | INT | NO | Khóa chính |
| course_id | INT | NO | Khóa ngoại → Course |
| finished_date | DATETIME | YES | Ngày hoàn thành khóa |
| process | INT | YES | Tiến độ khóa học (%) |

---

### 13. Learning_Process
**Mô tả:** Theo dõi tiến trình học tập của người dùng
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| process_id | INT | NO | Khóa chính |
| user_id | INT | YES | Khóa ngoại → Users |

---

### 14. Lesson_Note
**Mô tả:** Ghi chú/tài liệu đính kèm bài học
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| note_id | INT | NO | Khóa chính |
| lesson_id | INT | YES | Khóa ngoại → Lesson |
| attachment | NVARCHAR | YES | URL/tên file đính kèm |
| create_at | DATETIME | YES | Ngày tạo (mặc định: GETDATE()) |

---

## Review & Feedback Tables

### 15. Review
**Mô tả:** Đánh giá và bình luận khóa học
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| review_id | INT | NO | Khóa chính |
| user_id | INT | YES | Khóa ngoại → Users |
| course_id | INT | YES | Khóa ngoại → Course |
| rating | INT | YES | Điểm đánh giá (1-5) |
| comment | NVARCHAR | YES | Nội dung bình luận |

---

### 16. Wishlist
**Mô tả:** Danh sách yêu thích khóa học
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| user_id | INT | NO | Khóa chính (FK → Users) |
| course_id | INT | NO | Khóa chính (FK → Course) |

---

## User Management Tables (Bảng Quản Lý Quyền)

### 17. Roles
**Mô tả:** Các vai trò trong hệ thống
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| role_id | INT | NO | Khóa chính |
| roleName | NVARCHAR | YES | Tên vai trò (Admin, Instructor, Student) |

---

### 18. Account_Role
**Mô tả:** Gán vai trò cho người dùng
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| user_id | INT | NO | Khóa chính (FK → Users) |
| role_id | INT | NO | Khóa chính (FK → Roles) |

---

### 19. Features
**Mô tả:** Danh sách tính năng/chức năng
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| feature_id | INT | NO | Khóa chính |
| urlPath | NVARCHAR | YES | Đường dẫn chức năng (VD: /admin/users) |

---

### 20. Role_Feature
**Mô tả:** Gán quyền tính năng cho vai trò
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| role_id | INT | NO | Khóa chính (FK → Roles) |
| feature_id | INT | NO | Khóa chính (FK → Features) |

---

## Communication Tables (Bảng Giao Tiếp)

### 21. Chat
**Mô tả:** Hệ thống tin nhắn giữa người dùng
| Cột | Kiểu | Nullable | Mô tả |
|-----|------|---------|-------|
| chat_id | INT | NO | Khóa chính |
| sender_id | INT | YES | Khóa ngoại → Users (người gửi) |
| receiver_id | INT | YES | Khóa ngoại → Users (người nhận) |
| message | NVARCHAR | YES | Nội dung tin nhắn |
| status | NVARCHAR | YES | Trạng thái (sent/read/unread) |
| send_date | DATETIME | YES | Ngày gửi (mặc định: GETDATE()) |

---

## Database Diagram Relationships
Users (1) ──→ (N) Course (as instructor) │ ├─→ (N) Enrollment │ ├─→ (N) Invoice │ ├─→ (N) Cart │ ├─→ (N) Review │ ├─→ (N) Wishlist │ ├─→ (N) Chat (as sender/receiver) │ └─→ (N) Account_Role ←─ (N) Roles ←─ (N) Role_Feature ←─ Features
Category (1) ──→ (N) Course
Course (1) ──→ (N) Lesson │ ├─→ (N) Enrollment │ ├─→ (N) Invoice_Item ←─ (N) Invoice ←─ (1) Coupon │ ├─→ (N) Cart_Item ←─ (N) Cart │ ├─→ (N) Review │ ├─→ (N) Wishlist │ └─→ (N) Course_Process
Lesson (1) ──→ (N) Lesson_Process └─→ (N) Lesson_Note
Learning_Process ←─ User

---

## Key Points for AI Agents

- **Primary Keys:** Tất cả các bảng đều có khóa chính
- **Foreign Keys:** Các mối quan hệ được định nghĩa qua khóa ngoại
- **Cascade Deletion:** Invoice_Item tự động xóa khi Invoice bị xóa
- **Default Values:** Các cột timestamp sử dụng GETDATE()
- **Payment Integration:** Trường `order_id` trong Invoice dùng lưu ID từ Momo payment gateway
- **Status Fields:** Nhiều bảng có trường `status` để quản lý trạng thái
- **Progress Tracking:** Hệ thống theo dõi tiến độ ở 3 cấp độ: User → Course → Lesson

---
