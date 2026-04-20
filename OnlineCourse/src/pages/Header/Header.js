import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Nên cài thêm gói này
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { getUserFromToken, logout } from "../../utils/authUtils";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Header() {
    const { user } = useContext(AuthContext);
    const tokenUser = getUserFromToken();
    const currentUser = user || tokenUser;
    const { cart } = useCart();
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="main-header fixed-top">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">
                    {/* Logo */}
                    <Link className="navbar-brand fw-bold text-primary fs-3" to="/">
                        EDUMASTER
                    </Link>

                    {/* Mobile Toggle */}
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarContent">
                        {/* Left Menu */}
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                            <li className="nav-item">
                                <Link className="nav-link fw-medium" to="/courses">Khóa học</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-medium" to="/game">Giải trí</Link>
                            </li>
                        </ul>

                        {/* Search Bar (Centered) */}
                        <form className="d-flex mx-auto search-box my-2 my-lg-0">
                            <div className="input-group">
                                <input className="form-control border-end-0 shadow-none" type="search" placeholder="Tìm khóa học..." />
                                <button className="btn btn-outline-secondary border-start-0 shadow-none" type="submit">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </form>

                        {/* Right Icons & Auth */}
                        <div className="d-flex align-items-center ms-auto">
                            <Link to="/cart" className="nav-link position-relative me-4">
                                <i className="bi bi-cart3 fs-4"></i>
                                {cart.length > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cart.length}
                                    </span>
                                )}
                            </Link>

                            {currentUser ? (
                                <div className="dropdown">
                                    <button className="btn btn-light dropdown-toggle d-flex align-items-center border shadow-sm" type="button" data-bs-toggle="dropdown">
                                        <div className="avatar-sm me-2">{currentUser.name?.charAt(0)}</div>
                                        <span className="d-none d-md-inline">{currentUser.name}</span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                        <li><Link className="dropdown-item py-2" to="/profile">Hồ sơ của tôi</Link></li>
                                        {currentUser.role === 'admin' && (
                                            <li><Link className="dropdown-item py-2 text-primary" to="/admin">Quản trị viên</Link></li>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item py-2 text-danger" onClick={logoutHandler}>Đăng xuất</button></li>
                                    </ul>
                                </div>
                            ) : (
                                <Link className="btn btn-primary px-4 rounded-pill shadow-sm" to="/login">Đăng nhập</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}