import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { Link } from 'react-router-dom';
import { getUserFromToken, getUserRole, logout } from "../../utils/authUtils";
import { useCart } from "../../context/CartContext";

export default function Header() {
    const user = getUserFromToken();
    const role = getUserRole();
    const { cart } = useCart();

    const logoutHandler = () => {
        logout();
    };
    console.log("role:", role);
    console.log("user:", user);
    return (
        <div>
            <div className="header sticky-top">
                <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">Navbar</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/courses">Courses</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">
                                        Cart {cart.length > 0 && <span className="badge bg-danger ms-2">{cart.length}</span>}
                                    </Link>
                                </li>
                                {role === "admin" && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/admin" tabIndex="-1">Admin dashboard</Link>
                                    </li>
                                )}
                            </ul>
                            <form className="d-flex">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                            <div className="logout">
                                {user ? (
                                    <>
                                        <span className="welcome">Welcome, {user.name}</span>
                                        <button className="btn btn-danger" onClick={logoutHandler}>Logout</button>
                                    </>
                                ) : (
                                    <Link className="btn btn-primary" to="/login">Login</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
}
