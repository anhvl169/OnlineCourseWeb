// controllers/payment/paymentController.js
const https = require('https');
const crypto = require('crypto');
const orderRepo = require('../../repositories/order.repo.js');

const MOMO_CONFIG = {
    accessKey: process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85',
    secretKey: process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
    partnerCode: 'MOMO',
    endpoint: 'https://test-payment.momo.vn/v2/gateway/api/create'
};

const createPaymentLink = async (req, res) => {
    try {
        console.log('PAYMENT REQUEST RECEIVED');
        console.log('Raw req.body:', JSON.stringify(req.body, null, 2));
        
        let { amount, items, orderInfo, paymentMethod } = req.body;
        const user = req.user;

        console.log('Extracted from req.body:');
        console.log('  amount:', amount);
        console.log('  amount type:', typeof amount);
        console.log('  items count:', items?.length || 0);
        console.log('🔴🔴🔴 === END REQUEST === 🔴🔴🔴\n');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!amount || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount or items'
            });
        }

        const amountStr = String(Math.round(Number(amount)));

        // invoice DB
        const invoiceId = await orderRepo.createInvoice({
            user_id: user.user_id,
            coupon_id: null,
            total_amount: Number(amountStr),
            discount_amount: 0,
            final_amount: Number(amountStr),
            payment_method: paymentMethod || 'momo'
        });

        const invoiceItems = items.map(item => ({
            course_id: item.course_id,
            price: item.price
        }));

        await orderRepo.addInvoiceItems(invoiceId, invoiceItems);


        const orderId = MOMO_CONFIG.partnerCode + Date.now();
        const requestId = orderId;

        const redirectUrl = 'http://localhost:5000/api/payment/result';
        const ipnUrl = 'http://localhost:5000/api/payment/result';

        const extraData = invoiceId.toString();
        const requestType = "payWithMethod";

        // rawSignature
        const rawSignature =
            `accessKey=${MOMO_CONFIG.accessKey}` +
            `&amount=${amountStr}` +
            `&extraData=${extraData}` +
            `&ipnUrl=${ipnUrl}` +
            `&orderId=${orderId}` +
            `&orderInfo=${orderInfo || 'Online Course Payment'}` +
            `&partnerCode=${MOMO_CONFIG.partnerCode}` +
            `&redirectUrl=${redirectUrl}` +
            `&requestId=${requestId}` +
            `&requestType=${requestType}`;

        const signature = crypto
            .createHmac('sha256', MOMO_CONFIG.secretKey)
            .update(rawSignature)
            .digest('hex');

        // request body
        const requestBody = JSON.stringify({
            partnerCode: MOMO_CONFIG.partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId,
            amount: amountStr, // 🔥 QUAN TRỌNG
            orderId,
            orderInfo: orderInfo || 'Online Course Payment',
            redirectUrl,
            ipnUrl,
            lang: 'vi',
            requestType,
            autoCapture: true,
            extraData,
            signature
        });

        // call MoMo
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const momoReq = https.request(options, (momoRes) => {
            let data = '';

            momoRes.on('data', chunk => data += chunk);

            momoRes.on('end', () => {
                const result = JSON.parse(data);

                console.log("MOMO RESPONSE:", result);

                if (result.resultCode === 0) {
                    return res.json({
                        success: true,
                        message: 'Payment link created successfully',
                        data: {
                            payUrl: result.payUrl,
                            orderId: result.orderId,
                            amount: result.amount,
                            invoiceId: invoiceId,
                            momoResponse: result
                        }
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: result.message,
                        data: result
                    });
                }
            });
        });

        momoReq.on('error', err => {
            console.error("MOMO ERROR:", err);
            res.status(500).json({
                success: false,
                message: 'Momo request failed'
            });
        });

        momoReq.write(requestBody);
        momoReq.end();

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const handlePaymentIPN = async (req, res) => {
    try {
        console.log('Payment IPN received:', req.body);

        const { orderId, resultCode, message, transId, amount, extraData, signature } = req.body;

        // Verify signature
        const rawSignature = [
            `accessKey=${MOMO_CONFIG.accessKey}`,
            `amount=${amount}`,
            `extraData=${extraData}`,
            `message=${message}`,
            `orderId=${orderId}`,
            `orderInfo=null`,
            `orderType=null`,
            `partnerCode=${MOMO_CONFIG.partnerCode}`,
            `payType=null`,
            `requestId=${orderId}`,
            `responseTime=${new Date().getTime()}`,
            `resultCode=${resultCode}`,
            `transId=${transId}`
        ].join('&');

        const computedSignature = crypto.createHmac('sha256', MOMO_CONFIG.secretKey)
            .update(rawSignature)
            .digest('hex');

        if (signature !== computedSignature) {
            console.error('Invalid signature');
            return res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }

        // Update invoice status
        if (resultCode === '0' || resultCode === 0) {
            // Payment successful
            const invoiceId = parseInt(extraData);
            const updated = await orderRepo.updateInvoiceStatus(invoiceId, 'completed', {
                orderId: orderId,
                transId: transId,
                message: message,
                resultCode: resultCode
            });

            if (updated) {
                res.json({
                    success: true,
                    message: 'Payment successful',
                    invoiceId: invoiceId
                });
            }
        } else {
            // Payment failed
            const invoiceId = parseInt(extraData);
            await orderRepo.updateInvoiceStatus(invoiceId, 'failed', {
                orderId: orderId,
                transId: transId,
                message: message,
                resultCode: resultCode
            });

            res.json({
                success: false,
                message: 'Payment failed',
                invoiceId: invoiceId
            });
        }
    } catch (error) {
        console.error('Error in handlePaymentIPN:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error processing payment IPN'
        });
    }
};

const getPaymentResult = async (req, res) => {
    try {
        console.log('Payment result query received:', req.query);
        const { orderId, resultCode, message, transId } = req.query;

        console.log('Payment result:', { orderId, resultCode, message, transId });

        if (resultCode === '0' || resultCode === 0) {
            res.json({
                success: true,
                message: 'Payment successful',
                orderId: orderId,
                transId: transId
            });
        } else {
            res.json({
                success: false,
                message: message || 'Payment failed',
                orderId: orderId
            });
        }
    } catch (error) {
        console.error('Error in getPaymentResult:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error processing payment result'
        });
    }
};

module.exports = {
    createPaymentLink,
    handlePaymentIPN,
    getPaymentResult
};
