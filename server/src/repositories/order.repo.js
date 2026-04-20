// repositories/order.repo.js
const { sql } = require('./../config/db');

const createInvoice = async (invoiceData) => {
    try {
        const result = await new sql.Request()
            .input('user_id', sql.Int, invoiceData.user_id)
            .input('coupon_id', sql.Int, invoiceData.coupon_id || null)
            .input('total_amount', sql.Float, invoiceData.total_amount)
            .input('discount_amount', sql.Float, invoiceData.discount_amount || 0)
            .input('final_amount', sql.Float, invoiceData.final_amount)
            .input('payment_method', sql.VarChar(50), invoiceData.payment_method)
            .input('payment_status', sql.VarChar(50), 'pending')
            .query(`
                INSERT INTO Invoice (user_id, coupon_id, total_amount, discount_amount, final_amount, payment_method, payment_status, created_at)
                OUTPUT INSERTED.invoice_id
                VALUES (@user_id, @coupon_id, @total_amount, @discount_amount, @final_amount, @payment_method, @payment_status, GETDATE())
            `);

        return result.recordset[0].invoice_id;
    } catch (err) {
        console.error('Database error at createInvoice:', err);
        throw new Error('Database error');
    }
};

const addInvoiceItems = async (invoiceId, items) => {
    try {
        const request = new sql.Request();
        let query = '';

        items.forEach((item, index) => {
            request.input(`course_id_${index}`, sql.Int, item.course_id);
            request.input(`price_${index}`, sql.Float, item.price);
            query += `INSERT INTO Invoice_Item (invoice_id, course_id, price) VALUES (${invoiceId}, @course_id_${index}, @price_${index});`;
        });

        if (query) {
            await request.query(query);
        }

        return true;
    } catch (err) {
        console.error('Database error at addInvoiceItems:', err);
        throw new Error('Database error');
    }
};

const getInvoiceById = async (invoiceId) => {
    try {
        const result = await new sql.Request()
            .input('invoice_id', sql.Int, invoiceId)
            .query(`
                SELECT i.*, ii.invoice_item_id, ii.course_id, ii.price
                FROM Invoice i
                LEFT JOIN Invoice_Item ii ON i.invoice_id = ii.invoice_id
                WHERE i.invoice_id = @invoice_id
            `);

        if (result.recordset.length === 0) {
            return null;
        }
        
        const invoice = result.recordset[0];
        const items = result.recordset.filter(r => r.invoice_item_id !== null);
        
        return {
            ...invoice,
            items: items
        };
    } catch (err) {
        console.error('Database error at getInvoiceById:', err);
        throw new Error('Database error');
    }
};

const getInvoiceByOrderId = async (orderId) => {
    try {
        const result = await new sql.Request()
            .input('order_id', sql.VarChar(100), orderId)
            .query(`
                SELECT * FROM Invoice 
                WHERE order_id = @order_id
            `);

        if (result.recordset.length === 0) {
            return null;
        }
        return result.recordset[0];
    } catch (err) {
        console.error('Database error at getInvoiceByOrderId:', err);
        throw new Error('Database error');
    }
};

const updateInvoiceStatus = async (invoiceId, paymentStatus, transactionData) => {
    try {
        const result = await new sql.Request()
            .input('invoice_id', sql.Int, invoiceId)
            .input('payment_status', sql.VarChar(50), paymentStatus)
            .input('order_id', sql.VarChar(100), transactionData?.orderId || null)
            .query(`
                UPDATE Invoice 
                SET payment_status = @payment_status,
                    order_id = @order_id,
                    updated_at = GETDATE()
                WHERE invoice_id = @invoice_id
            `);

        return result.rowsAffected[0] > 0;
    } catch (err) {
        console.error('Database error at updateInvoiceStatus:', err);
        throw new Error('Database error');
    }
};

const getUserInvoices = async (userId) => {
    try {
        const result = await new sql.Request()
            .input('user_id', sql.Int, userId)
            .query(`
                SELECT * FROM Invoice 
                WHERE user_id = @user_id 
                ORDER BY created_at DESC
            `);

        return result.recordset;
    } catch (err) {
        console.error('Database error at getUserInvoices:', err);
        throw new Error('Database error');
    }
};

module.exports = {
    createInvoice,
    addInvoiceItems,
    getInvoiceById,
    getInvoiceByOrderId,
    updateInvoiceStatus,
    getUserInvoices
};
