import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function PaymentResult() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('checking');
    const [message, setMessage] = useState('Đang kiểm tra kết quả thanh toán...');

    useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                const resultCode = searchParams.get('resultCode');
                const message = searchParams.get('message');
                const orderId = searchParams.get('orderId');
                const transId = searchParams.get('transId');

                console.log('Payment result:', { resultCode, message, orderId, transId });

                if (resultCode === '0' || resultCode === 0) {
                    setStatus('success');
                    setMessage('Thanh toán thành công!');
                    // Auto redirect after 3 seconds
                    setTimeout(() => {
                        navigate('/');
                        sessionStorage.removeItem('lastInvoiceId');
                    }, 3000);
                } else {
                    setStatus('failed');
                    setMessage(message || 'Thanh toán thất bại. Vui lòng thử lại!');
                    setTimeout(() => {
                        navigate('/cart');
                    }, 5000);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
                setStatus('error');
                setMessage('Có lỗi xảy ra. Vui lòng kiểm tra lại.');
                setTimeout(() => {
                    navigate('/cart');
                }, 5000);
            }
        };

        checkPaymentStatus();
    }, [searchParams, navigate]);

    return (
        <div className="container mt-5 py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0">
                        <div className="card-body text-center py-5">
                            {status === 'checking' && (
                                <>
                                    <div className="spinner-border text-primary mb-3" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <h5 className="card-title mb-3">Đang kiểm tra...</h5>
                                    <p className="text-muted">{message}</p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <i className="bi bi-check-circle text-success display-1"></i>
                                    <h5 className="card-title mt-3 mb-3 text-success">Thanh toán thành công!</h5>
                                    <p className="text-muted mb-3">Cảm ơn bạn đã mua khóa học của chúng tôi</p>
                                    <p className="small text-muted">Bạn sẽ được chuyển về trang chủ trong giây lát...</p>
                                </>
                            )}

                            {status === 'failed' && (
                                <>
                                    <i className="bi bi-x-circle text-danger display-1"></i>
                                    <h5 className="card-title mt-3 mb-3 text-danger">Thanh toán thất bại</h5>
                                    <p className="text-muted mb-3">{message}</p>
                                    <p className="small text-muted">Bạn sẽ được chuyển về giỏ hàng để thử lại...</p>
                                    <button className="btn btn-primary mt-3" onClick={() => navigate('/cart')}>
                                        Quay lại giỏ hàng
                                    </button>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <i className="bi bi-exclamation-triangle text-warning display-1"></i>
                                    <h5 className="card-title mt-3 mb-3 text-warning">Có lỗi xảy ra</h5>
                                    <p className="text-muted mb-3">{message}</p>
                                    <button className="btn btn-primary mt-3" onClick={() => navigate('/cart')}>
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
