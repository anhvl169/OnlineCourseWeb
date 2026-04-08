import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Cart() {
    const { cart, total, loading, removeFromCart } = useCart();
    const navigate = useNavigate();

    const handleRemove = async (cartItemId) => {
        const result = await removeFromCart(cartItemId);
        if (!result.success) {
            alert(result.message);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <p>Đang tải giỏ hàng...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold">🛒 Giỏ hàng của bạn</h2>

            {cart.length === 0 ? (
                <div className="text-center mt-5">
                    <h5>Giỏ hàng trống</h5>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/courses')}
                    >
                        Khám phá khóa học
                    </button>
                </div>
            ) : (
                <div className="row">

                    {/* LEFT - CART ITEMS */}
                    <div className="col-md-8">
                        {cart.map(item => (
                            <div key={item.cart_item_id} className="card mb-3 shadow-sm border-0">
                                <div className="row g-0 align-items-center">

                                    {/* IMAGE */}
                                    <div className="col-md-4">
                                        <img
                                            src={item.imgUrl}
                                            className="img-fluid rounded-start"
                                            style={{ height: "150px", objectFit: "cover" }}
                                            alt={item.title}
                                        />
                                    </div>

                                    {/* INFO */}
                                    <div className="col-md-5">
                                        <div className="card-body">
                                            <h5 className="card-title mb-1">
                                                {item.title}
                                            </h5>
                                            <p className="text-muted mb-2">
                                                Khóa học chất lượng cao
                                            </p>
                                            <span className="fw-bold text-success">
                                                ${item.price}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ACTION */}
                                    <div className="col-md-3 text-center">
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => handleRemove(item.cart_item_id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT - SUMMARY */}
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 position-sticky" style={{ top: "100px" }}>
                            <div className="card-body">
                                <h5 className="mb-3">Tóm tắt đơn hàng</h5>

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Số lượng</span>
                                    <span>{cart.length}</span>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between">
                                    <strong>Tổng</strong>
                                    <strong className="text-success">
                                        ${total.toFixed(2)}
                                    </strong>
                                </div>

                                <button className="btn btn-primary w-100 mt-3">
                                    Thanh toán
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}