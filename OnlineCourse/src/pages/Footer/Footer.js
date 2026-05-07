import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Footer() {
    return (
        <footer className="bg-white text-center text-lg-start border-top mt-auto">
            <div className="container p-4">
                <div className="row">
                    {/* Brand & Social */}
                    <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
                        <h5 className="text-uppercase fw-bold text-primary">Edumaster</h5>
                        <p className="text-muted">
                            Nền tảng học trực tuyến hàng đầu, giúp bạn chinh phục kiến thức mọi lúc mọi nơi.
                        </p>
                        <div className="mt-3">
                            <a href="#" className="btn btn-outline-primary btn-sm rounded-circle me-2"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="btn btn-outline-primary btn-sm rounded-circle me-2"><i className="bi bi-youtube"></i></a>
                            <a href="#" className="btn btn-outline-primary btn-sm rounded-circle"><i className="bi bi-linkedin"></i></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h6 className="text-uppercase fw-bold mb-3">Về chúng tôi</h6>
                        <ul className="list-unstyled mb-0">
                            <li><a href="#!" className="text-muted text-decoration-none small">Giới thiệu</a></li>
                            <li><a href="#!" className="text-muted text-decoration-none small">Điều khoản</a></li>
                            <li><a href="#!" className="text-muted text-decoration-none small">Chính sách bảo mật</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h6 className="text-uppercase fw-bold mb-3">Liên hệ</h6>
                        <ul className="list-unstyled mb-0 small text-muted">
                            <li className="mb-2"><i className="bi bi-geo-alt me-2"></i> Hà Nội, Việt Nam</li>
                            <li className="mb-2"><i className="bi bi-envelope me-2"></i> support@edumaster.com</li>
                            <li><i className="bi bi-telephone me-2"></i> +84 123 456 789</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center p-3 border-top bg-light text-muted small">
                © {new Date().getFullYear()} Copyright: 
                <a className="text-primary fw-bold text-decoration-none ms-1" href="/">EDUMASTER.COM</a>
            </div>
        </footer>
    );
}