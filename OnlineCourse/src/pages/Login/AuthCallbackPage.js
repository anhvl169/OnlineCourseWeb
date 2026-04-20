import { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            navigate('/login');
            return;
        }

        try {
            localStorage.setItem('token', token);

            const decoded = jwtDecode(token);
            console.log("Decoded user:", decoded);

            setUser(decoded);

            // 4. clean URL
            window.history.replaceState({}, document.title, "/");

            navigate('/');

        } catch (err) {
            console.error("Decode error:", err);
            localStorage.removeItem("token");
            navigate('/login');
        }

    }, []);

    return <div>Logging you in...</div>;
};

export default AuthCallbackPage;