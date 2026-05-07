const { sql } = require('./../config/db');
const { AI_USER_ID } = require("./../config/system");
const insertMessage = async (conversationId, senderId, content) => {
    try {
        const result = await sql.query`
        INSERT INTO Messages (conversationId, senderId, content)
        OUTPUT INSERTED.*
        VALUES (${conversationId}, ${senderId}, ${content})
    `;

        return result.recordset[0];
    } catch (err) {
        console.error("Database error in insertMessage:", err);
        throw err;
    }
};

const findExistingConversation = async (userId1, userId2, type = "human") => {
    try {
        if (!userId1 || !userId2) {
            throw new Error("Both userId1 and userId2 are required");
        }
        const key = [userId1, userId2].sort().join("_");

        const result = await sql.query`
        SELECT TOP 1 *
        FROM Conversations
        WHERE userKey = ${key}
        AND type = ${type}
        AND isGroup = 0
    `;

        return result.recordset[0];
    } catch (err) {
        console.error("Database error in findExistingConversation:", err);
        throw err;
    }
};

const createConversation = async (userId, otherUserId, type = 'human') => {
    if (!otherUserId) {
        throw new Error("otherUserId is required");
    }
    if (!userId) {
        throw new Error("userId is required");
    }
    const userKey = [userId, otherUserId].sort().join("_");

    // 1. CHECK EXISTING
    const existing = await sql.query`
        SELECT TOP 1 *
        FROM Conversations
        WHERE userKey = ${userKey}
        AND type = ${type}
        AND isGroup = 0
    `;

    if (existing.recordset.length > 0) {
        return existing.recordset[0];
    }
    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        const existing = await new sql.Request(transaction)
            .input("userId", sql.Int, userId)
            .input("otherUserId", sql.Int, otherUserId)
            .input("type", sql.NVarChar, type)
            .query(`
                SELECT TOP 1 c.id
                FROM Conversations c
                JOIN ConversationMembers cm1
                    ON cm1.conversationId = c.id
                JOIN ConversationMembers cm2
                    ON cm2.conversationId = c.id
                WHERE cm1.userId = @userId
                  AND cm2.userId = @otherUserId
                  AND c.type = @type
            `);

        if (existing.recordset.length > 0) {

            await transaction.commit();

            return await getConversationById(
                existing.recordset[0].id
            );
        }

        // 1. tạo conversation mới
        const convResult = await new sql.Request(transaction)
            .input("type", sql.NVarChar, type)
            .input("userKey", sql.NVarChar, userKey)
            .query(`
                INSERT INTO Conversations (isGroup, type, userKey)
                OUTPUT INSERTED.*
                VALUES (0, @type, @userKey)
            `);

        const conv = convResult.recordset[0];

        // 2. thêm user hiện tại
        await new sql.Request(transaction)
            .input("convId", sql.Int, conv.id)
            .input("userId", sql.Int, userId)
            .query(`
                INSERT INTO ConversationMembers (conversationId, userId)
                VALUES (@convId, @userId)
            `);

        // 3. thêm user còn lại
        await new sql.Request(transaction)
            .input("convId", sql.Int, conv.id)
            .input("otherUserId", sql.Int, otherUserId)
            .query(`
                INSERT INTO ConversationMembers (conversationId, userId)
                VALUES (@convId, @otherUserId)
            `);

        // 4. AI welcome message
        if (type === "ai") {

            await new sql.Request(transaction)
                .input("convId", sql.Int, conv.id)
                .input("senderId", sql.Int, AI_USER_ID)
                .input("content", sql.NVarChar, "Xin chào 👋 Bạn cần mình giúp gì?")
                .query(`
                    INSERT INTO Messages (conversationId, senderId, content, type)
                    VALUES (@convId, @senderId, @content, 'text')
                `);
        }

        await transaction.commit();

        return conv;

    } catch (err) {
        await transaction.rollback();
        console.error("createConversation error:", err);
        throw err;
    }
};

const getUserConversations = async (userId) => {
    try {
        const result = await sql.query`

SELECT
    c.id,
    c.type,

    u.user_id as otherUserId,
    u.name as otherUserName,

    MAX(m.createdAt) as lastTime,

    (
        SELECT TOP 1 content
        FROM Messages
        WHERE conversationId = c.id
        ORDER BY createdAt DESC
    ) as lastMessage

FROM Conversations c

JOIN ConversationMembers myMember
    ON myMember.conversationId = c.id

JOIN ConversationMembers otherMember
    ON otherMember.conversationId = c.id
    AND otherMember.userId != ${userId}

-- ĐÃ SỬA: Đổi u.id thành u.user_id
JOIN Users u
    ON u.user_id = otherMember.userId

LEFT JOIN Messages m
    ON m.conversationId = c.id

WHERE myMember.userId = ${userId}

GROUP BY
    c.id,
    c.type,
    u.user_id,
    u.name

ORDER BY lastTime DESC
    `;

        return result.recordset;
    } catch (err) {
        console.error("Database error in getUserConversations:", err);
        throw err;
    }
};

const getConversationById = async (id) => {

    const result = await sql.query`
        SELECT *
        FROM Conversations
        WHERE id = ${id}
    `;

    return result.recordset[0];
};

const getMessages = async (conversationId, page, limit) => {
    try {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 20;

        const offset = (pageNum - 1) * limitNum;

        const result = await sql.query`
            SELECT *
            FROM Messages
            WHERE conversationId = ${conversationId}
            ORDER BY createdAt DESC
            OFFSET ${offset} ROWS FETCH NEXT ${limitNum} ROWS ONLY
        `;

        return result.recordset;
    } catch (err) {
        console.error("Database error in getMessages:", err);
        throw err;
    }
};

module.exports = {
    insertMessage,
    getUserConversations,
    getMessages,
    createConversation,
    findExistingConversation,
    getConversationById
};
