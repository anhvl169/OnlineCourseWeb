import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useLocation } from 'react-router-dom'; // Import thêm useLocation

export default function Layout({ children }) {
    const location = useLocation();

    // Kiểm tra xem người dùng có đang ở trang chat không
    const isChatPage = location.pathname.startsWith('/chat');

    return (
        // Thêm d-flex, flex-column và min-vh-100 để biến Layout thành khung 100% chiều cao
        <div className="d-flex flex-column min-vh-100">
            <Header />

            {/* Thêm flex-grow-1 để thẻ main tự động dãn ra, đẩy Footer xuống đáy */}
            <main className="flex-grow-1">
                {children}
            </main>

            {/* Chỉ hiển thị Footer nếu KHÔNG phải là trang Chat */}
            {!isChatPage && <Footer />}
        </div>
    )
}