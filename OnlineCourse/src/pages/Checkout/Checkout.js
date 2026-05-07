import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { getUserFromToken } from "../../utils/authUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { cart, total } = useCart();
    const tokenUser = getUserFromToken();
    const currentUser = user || tokenUser;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentStarted, setPaymentStarted] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [qrImage, setQrImage] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [invoiceId, setInvoiceId] = useState(null);

    const paymentMethod = location.state?.method || "momo";

    useEffect(() => {
        console.log('Checkout effect triggered with cart:', cart, 'total:', total);

        if (!cart || cart.length === 0) {
            console.log('Cart is empty, redirecting to /cart');
            alert("Giỏ hàng của bạn đang trống!");
            navigate('/cart');
            return;
        }
        if (!paymentMethod) {
            console.log('Payment method not selected');
            alert("Vui lòng chọn phương thức thanh toán!");
            navigate('/cart');
            return;
        }

        // Only start payment once
        if (!paymentStarted) {
            console.log('Starting payment with:', { cart, total, paymentMethod });
            setPaymentStarted(true);
            handlePayment();
        }
    }, [cart, total, paymentMethod, navigate, paymentStarted]);

    const handlePayment = async () => {
        if (!cart || cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            navigate('/cart');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const requestPayload = {
                amount: total,
                items: cart.map(item => ({
                    course_id: item.course_id,
                    price: item.price,
                    title: item.title
                })),
                orderInfo: `Order from user ${currentUser?.email || 'guest'}`,
                paymentMethod: paymentMethod
            };

            console.log('Request payload:', JSON.stringify(requestPayload, null, 2));

            const fetchBody = JSON.stringify(requestPayload);
            console.log('Actual fetch body being sent:', fetchBody);

            const response = await fetch("http://localhost:5000/api/payment/create-link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(requestPayload)
            });

            const data = await response.json();
            console.log('Payment link response:', data);

            const paymentData = data.data || data;
            const payUrl = paymentData?.payUrl || data?.payUrl;
            const invoiceIdFromResponse = paymentData?.invoiceId || data?.invoiceId;
            const pOrderId = paymentData?.orderId;
            const amount = paymentData?.amount;

            if (data.success) {
                sessionStorage.setItem('lastInvoiceId', invoiceIdFromResponse);
                setInvoiceId(invoiceIdFromResponse);
                if (pOrderId) {
                    sessionStorage.setItem('lastOrderId', pOrderId);
                    setOrderId(pOrderId);
                }
                console.log('Payment link created successfully!');
                if (amount) console.log('Confirmed amount:', amount);

                if (paymentMethod === "qr") {
                    // Generate QR code URL using VietQR API
                    const accountName = "VU LE ANH";
                    const bankCode = "970423";
                    const accountNumber = "00000111905";
                    const reference = "utajn2T";
                    const addInfo = pOrderId || (currentUser?.email || 'guest');
                    
                    const qrUrl = `https://api.vietqr.io/image/${bankCode}-${accountNumber}-${reference}.jpg?accountName=${encodeURIComponent(accountName)}&amount=${total}&addInfo=${encodeURIComponent(addInfo)}`;
                    setQrImage(qrUrl);
                    setLoading(false);
                } else if (payUrl) {
                    setRedirectUrl(payUrl);
                    setLoading(false);
                } else {
                    setError("Không thể lấy link thanh toán");
                    setTimeout(() => navigate('/cart'), 3000);
                }
            } else {
                setError(data.message || "Không tạo được link thanh toán");
                setTimeout(() => navigate('/cart'), 3000);
            }
        } catch (error) {
            console.error('Payment error:', error);
            setError("Đã có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại sau.");
            setTimeout(() => navigate('/cart'), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-body text-center py-5">
                            {loading && (
                                <>
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <h5 className="card-title mb-3">Đang chuyển hướng đến cổng thanh toán...</h5>
                                    <p className="text-muted">Vui lòng chờ một chút, hệ thống đang xử lý thanh toán của bạn</p>
                                </>
                            )}

                            {error && (
                                <>
                                    <i className="bi bi-exclamation-circle text-danger display-1"></i>
                                    <h5 className="card-title mt-3 mb-3 text-danger">Lỗi thanh toán</h5>
                                    <p className="text-muted mb-3">{error}</p>
                                    <p className="small text-muted">Bạn sẽ được chuyển về giỏ hàng...</p>
                                </>
                            )}

                            {!loading && !error && (
                                <>
                                    <i className="bi bi-hourglass-split text-primary display-1"></i>
                                    <h5 className="card-title mt-3 mb-3">Chuẩn bị thanh toán</h5>
                                    <p className="text-muted">Đang khởi tạo giao dịch...</p>
                                </>
                            )}

                            {!loading && !error && redirectUrl && (
                                <>
                                    <i className="bi bi-check-circle text-success display-1"></i>
                                    <h5 className="card-title mt-3 mb-3">✅ Sẵn sàng thanh toán</h5>
                                    <p className="text-muted mb-4">Link thanh toán đã được tạo. Bấm nút dưới để chuyển sang MoMo</p>
                                    <button
                                        className="btn btn-primary btn-lg w-100"
                                        onClick={() => window.location.href = redirectUrl}
                                    >
                                        <i className="bi bi-arrow-right me-2"></i>Chuyển sang MoMo
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary btn-sm w-100 mt-3"
                                        onClick={() => navigate('/cart')}
                                    >
                                        Quay lại giỏ hàng
                                    </button>
                                </>
                            )}

                            {!loading && !error && qrImage && (
                                <>
                                    <i className="bi bi-qr-code text-primary display-1"></i>
                                    <h5 className="card-title mt-3 mb-3">✅ Mã QR Thanh Toán</h5>
                                    <p className="text-muted mb-3">Quét mã QR bằng ứng dụng ngân hàng để hoàn tất thanh toán</p>
                                    <div className="text-center mb-4">
                                        <img 
                                            src={qrImage} 
                                            alt="QR Code" 
                                            style={{
                                                maxWidth: '300px',
                                                width: '100%',
                                                border: '1px solid #ddd',
                                                padding: '10px',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </div>
                                    <div className="text-start bg-light p-3 rounded mb-3">
                                        <p className="mb-2"><strong>Thông tin chuyển khoản:</strong></p>
                                        <p className="mb-2">
                                            <span className="text-muted">Số tiền:</span> <strong>{total.toLocaleString('vi-VN')} VND</strong>
                                        </p>
                                        <p className="mb-2">
                                            <span className="text-muted">Nội dung:</span> <strong>{orderId || (currentUser?.email || 'Thanh toán khóa học')}</strong>
                                        </p>
                                        <p className="mb-0">
                                            <span className="text-muted">Ngân hàng:</span> <strong>TP Bank</strong>
                                        </p>
                                    </div>
                                    <div className="alert alert-info mb-3" role="alert">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Vui lòng chuyển khoản và chờ hệ thống xác nhận trong giây lát
                                    </div>
                                    <button
                                        className="btn btn-outline-secondary btn-sm w-100"
                                        onClick={() => navigate('/cart')}
                                    >
                                        Quay lại giỏ hàng
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}