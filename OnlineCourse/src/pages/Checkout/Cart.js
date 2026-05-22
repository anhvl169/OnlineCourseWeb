import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Cart() {
    const { cart, total, loading, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("momo");

    const handleRemove = async (cartItemId) => {
        const result = await removeFromCart(cartItemId);
        if (!result.success) alert(result.message);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        if (!paymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        navigate('/checkout', { state: { method: paymentMethod } });
    };
    if (loading) return <div className="container mt-5 text-center"><p>Đang tải giỏ hàng...</p></div>;

    return (
        <div className="container mt-5 py-5">
            <h2 className="mb-4 fw-bold"><i className="bi bi-cart3 me-2"></i>Giỏ hàng của bạn</h2>

            {cart.length === 0 ? (
                <div className="text-center mt-5 py-5 border rounded bg-light">
                    <i className="bi bi-bag-x text-muted display-1"></i>
                    <h5 className="mt-3">Giỏ hàng của bạn đang trống</h5>
                    <button className="btn btn-primary mt-3 px-4 rounded-pill" onClick={() => navigate('/')}>
                        Khám phá khóa học ngay
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {/* LEFT - CART ITEMS */}
                    <div className="col-md-8">
                        {cart.map(item => (
                            <div key={item.cart_item_id} className="card mb-3 shadow-sm border-0 transition-hover" data-testid={`cart-item-${item.course_id}`}>
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-3">
                                        <img src={item.imgUrl} className="img-fluid rounded-start h-100 w-100 object-fit-cover"
                                            style={{ maxHeight: "120px" }} alt={item.title} />
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card-body">
                                            <h6 className="fw-bold mb-1">{item.title}</h6>
                                            <p className="small text-muted mb-0">Giảng viên: Master Admin</p>
                                            <span className="fw-bold text-primary">{item.price.toLocaleString()}đ</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3 text-center text-md-end pe-md-4">
                                        <button className="btn btn-sm btn-outline-danger border-0"
                                            onClick={() => handleRemove(item.cart_item_id)}
                                            data-testid={`remove-course-${item.course_id}`}
                                        >
                                            <i className="bi bi-trash3 me-1"></i> Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT - SUMMARY & PAYMENT */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 sticky-top" style={{ top: "100px" }}>
                            <div className="card-body">
                                <h5 className="fw-bold mb-4 text-center">Chi tiết thanh toán</h5>

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tạm tính ({cart.length} món)</span>
                                    <span>{total.toLocaleString()}đ</span>
                                </div>
                                <hr className="text-muted" />

                                {/* CHOOSE PAYMENT METHOD */}
                                <p className="fw-bold mb-3 small">CHỌN PHƯƠNG THỨC THANH TOÁN</p>

                                <div className="payment-options d-grid gap-2">
                                    {/* MOMO */}
                                    <input type="radio" className="btn-check" name="payment" id="momo" autoComplete="off"
                                        checked={paymentMethod === "momo"} onChange={() => setPaymentMethod("momo")} />
                                    <label className="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-3 rounded-3" htmlFor="momo">
                                        <div className="d-flex align-items-center">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZcQPC-zWVyFOu9J2OGl0j2D220D49D0Z7BQ&s" width="24" className="me-3" alt="momo" />
                                            <span>Ví MoMo</span>
                                        </div>
                                        {paymentMethod === "momo" && <i className="bi bi-check-circle-fill text-primary"></i>}
                                    </label>

                                    {/* VNPAY */}
                                    <input type="radio" className="btn-check" name="payment" id="vnpay" autoComplete="off"
                                        checked={paymentMethod === "vnpay"} onChange={() => setPaymentMethod("vnpay")} />
                                    <label className="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-3 rounded-3" htmlFor="vnpay">
                                        <div className="d-flex align-items-center">
                                            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" width="24" className="me-3" alt="vnpay" />
                                            <span>VNPAY</span>
                                        </div>
                                        {paymentMethod === "vnpay" && <i className="bi bi-check-circle-fill text-primary"></i>}
                                    </label>

                                    {/* QR TRANSFER */}
                                    <input type="radio" className="btn-check" name="payment" id="qr" autoComplete="off"
                                        checked={paymentMethod === "qr"} onChange={() => setPaymentMethod("qr")} />
                                    <label className="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-3 rounded-3" htmlFor="qr">
                                        <div className="d-flex align-items-center">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" width="24" className="me-3" alt="qr" />
                                            <span>QR Pay</span>
                                        </div>
                                        {paymentMethod === "qr" && <i className="bi bi-check-circle-fill text-primary"></i>}
                                    </label>

                                    {/* BANK TRANSFER */}
                                    <input type="radio" className="btn-check" name="payment" id="bank" autoComplete="off"
                                        checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} />
                                    <label className="btn btn-outline-light text-dark border d-flex align-items-center justify-content-between p-3 rounded-3" htmlFor="bank">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-bank2 me-3 fs-5 text-secondary"></i>
                                            <span>Chuyển khoản ngân hàng</span>
                                        </div>
                                        {paymentMethod === "bank" && <i className="bi bi-check-circle-fill text-primary"></i>}
                                    </label>
                                </div>

                                <div className="d-flex justify-content-between mt-4">
                                    <strong className="fs-5">Tổng cộng</strong>
                                    <strong className="fs-5 text-primary">{total.toLocaleString()}đ</strong>
                                </div>

                                <button className="btn btn-primary w-100 mt-4 fw-bold py-3 rounded-3 shadow"
                                    onClick={() => navigate('/checkout', { state: { method: paymentMethod } })}>
                                    THANH TOÁN NGAY
                                </button>

                                <p className="text-center text-muted small mt-3">
                                    <i className="bi bi-shield-check me-1"></i> Thanh toán an toàn & bảo mật
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}