import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useLocation } from 'react-router-dom'; 

export default function Layout({ children }) {
    const location = useLocation();

    const isChatPage = location.pathname.startsWith('/chat');

    return (

        <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="flex-grow-1">
                {children}
            </main>

            {!isChatPage && <Footer />}
        </div>
    )
}