// repositories/user.repo.js
const { sql } = require('./../config/db');
const findByEmail = async (email) => {

    try {
        const result = await new sql.Request()
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM Users WHERE email = @email');

        if (result.recordset.length === 0) {
            console.log(`User with email ${email} not found`);
            return null;
        } else {
            console.log(`User with email ${email} found:`, result.recordset[0]);
        }

        return result.recordset[0];
    } catch (err) {
        console.error('Database error:', err);
        throw new Error('Database error');
    }

};

const createUser = async (user) => {
    try {
        const result = await new sql.Request()
            .input('email', sql.VarChar, user.email)
            .input('password', sql.VarChar, user.password)
            .input('name', sql.NVarChar, user.name)
            .input('status', sql.NVarChar, 'active')
            .input('google_id', sql.VarChar, user.google_id)
            .query(`
            INSERT INTO Users (email, password, name,status, google_id)
            OUTPUT INSERTED.user_id
            VALUES (@email, @password, @name, @status, @google_id)
        `);

        return result.recordset[0].user_id;
    } catch (err) {
        console.error('Database error at createUser:', err);
        throw new Error('Database error');
    }
};
const getRolesByUserId = async (userId) => {

    const result = await new sql.Request()
        .input('userId', sql.Int, userId)
        .query(`
            SELECT r.roleName
            FROM Account_Role ar
            JOIN Roles r ON ar.role_id = r.role_id
            WHERE ar.user_id = @userId
        `);

    return result.recordset.map(r => r.roleName);
};

const assignRole = async (userId, roleName) => {
    try {
        await new sql.Request()
            .input('userId', sql.Int, userId)
            .input('roleName', sql.VarChar, roleName)
            .query(`
            INSERT INTO Account_Role (user_id, role_id)
            SELECT @userId, role_id FROM Roles WHERE roleName = @roleName
        `);
    } catch (err) {
        console.error('Database error at assignRole:', err);
        throw new Error('Database error');
    }
};

const getUserProfile = async (userId) => {
    try {
        const result = await new sql.Request()
            .input('userId', sql.Int, userId)
            .query('SELECT user_id, name, email, phone, address, bio, status FROM Users WHERE user_id = @userId');

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset[0];
    } catch (err) {
        console.error('Database error at getUserProfile:', err);
        throw new Error('Database error');
    }
};

const updateUserProfile = async (userId, profileData) => {
    try {
        const result = await new sql.Request()
            .input('userId', sql.Int, userId)
            .input('name', sql.NVarChar, profileData.name)
            .input('phone', sql.VarChar, profileData.phone)
            .input('address', sql.NVarChar, profileData.address)
            .input('bio', sql.NVarChar, profileData.bio)
            .query(`
                UPDATE Users 
                SET name = @name, phone = @phone, address = @address, bio = @bio
                WHERE user_id = @userId
                SELECT user_id, name, email, phone, address, bio FROM Users WHERE user_id = @userId
            `);

        if (result.recordset.length === 0) {
            return null;
        }

        return result.recordset[0];
    } catch (err) {
        console.error('Database error at updateUserProfile:', err);
        throw new Error('Database error');
    }
};

const getEnrolledCourses = async (userId) => {
    try {
        const result = await new sql.Request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    e.enrollment_id,
                    e.course_id,
                    e.purchase_date,
                    e.progress,
                    c.title,
                    c.description,
                    c.price,
                    c.imgUrl,
                    u.name AS instructor_name
                FROM Enrollment e
                JOIN Course c ON e.course_id = c.course_id
                LEFT JOIN Users u ON c.instructor_id = u.user_id
                WHERE e.user_id = @userId
                ORDER BY e.purchase_date DESC
            `);

        return result.recordset;
    } catch (err) {
        console.error('Database error at getEnrolledCourses:', err);
        throw new Error('Database error');
    }
};

const getUserInvoices = async (userId) => {
    try {
        const result = await new sql.Request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    i.invoice_id,
                    i.user_id,
                    i.coupon_id,
                    i.total_amount,
                    i.discount_amount,
                    i.final_amount,
                    i.payment_method,
                    i.payment_status,
                    i.created_at,
                    i.updated_at,
                    i.order_id
                FROM Invoice i
                WHERE i.user_id = @userId
                ORDER BY i.created_at DESC
            `);

        return result.recordset;
    } catch (err) {
        console.error('Database error at getUserInvoices:', err);
        throw new Error('Database error');
    }
};

const getInvoiceItems = async (invoiceId) => {
    try {
        const result = await new sql.Request()
            .input('invoiceId', sql.Int, invoiceId)
            .query(`
                SELECT 
                    ii.invoice_item_id,
                    ii.invoice_id,
                    ii.course_id,
                    ii.price,
                    ii.created_at,
                    c.title,
                    c.description,
                    c.imgUrl
                FROM Invoice_Item ii
                JOIN Course c ON ii.course_id = c.course_id
                WHERE ii.invoice_id = @invoiceId
            `);

        return result.recordset;
    } catch (err) {
        console.error('Database error at getInvoiceItems:', err);
        throw new Error('Database error');
    }
};

module.exports = {
    findByEmail,
    createUser,
    getRolesByUserId,
    assignRole,
    getUserProfile,
    updateUserProfile,
    getEnrolledCourses,
    getUserInvoices,
    getInvoiceItems
};