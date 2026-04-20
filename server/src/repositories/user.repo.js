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

module.exports = {
    findByEmail,
    createUser,
    getRolesByUserId,
    assignRole
};