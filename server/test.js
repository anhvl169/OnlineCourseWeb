const https = require('https');
const crypto = require('crypto');

// 🔐 CONFIG
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';

const orderInfo = 'Test payment 22565';
//https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b
const redirectUrl = 'http://localhost:5000/api/payment/result';
//https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b
const ipnUrl = 'http://localhost:5000/api/payment/result';

const requestType = "payWithMethod";
const amount = '22565'; // 🔥 TEST AMOUNT

const orderId = partnerCode + Date.now();
const requestId = orderId;

const extraData = '';
const orderGroupId = '';
const autoCapture = true;
const lang = 'vi';

// 🔐 SIGNATURE
const rawSignature =
    `accessKey=${accessKey}` +
    `&amount=${amount}` +
    `&extraData=${extraData}` +
    `&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}` +
    `&requestId=${requestId}` +
    `&requestType=${requestType}`;

console.log("\n✅ RAW SIGNATURE:");
console.log(rawSignature);

const signature = crypto
    .createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

console.log("\n✅ SIGNATURE:");
console.log(signature);

// 📦 REQUEST BODY
const requestBody = JSON.stringify({
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang,
    requestType,
    autoCapture,
    extraData,
    orderGroupId,
    signature
});

console.log("\n📊 REQUEST BODY:");
console.log(JSON.stringify(JSON.parse(requestBody), null, 2));

// 🌐 HTTPS REQUEST
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

console.log("\n🔄 SENDING REQUEST TO MOMO...\n");

const req = https.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    
    let responseBody = '';
    
    res.on('data', (chunk) => {
        responseBody += chunk;
    });
    
    res.on('end', () => {
        console.log("\n📥 MOMO RESPONSE:");
        try {
            const data = JSON.parse(responseBody);
            console.log(JSON.stringify(data, null, 2));
            console.log("\n✅ Amount in response:", data.amount);
            console.log("✅ Result Code:", data.resultCode);
            console.log("✅ Pay URL:", data.payUrl);
        } catch (e) {
            console.log(responseBody);
        }
    });
});

req.on('error', (e) => {
    console.error(`❌ Error: ${e.message}`);
});

req.write(requestBody);
req.end();