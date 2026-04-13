import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const OnboardingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 2. Lưu token vào localStorage
            localStorage.setItem('token', token);
            window.history.replaceState({}, document.title, "/onboarding");
        } else if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitProfile = async (data) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/onboarding', {
                method: 'POST', // hoặc PUT tùy cách bạn thiết kế RESTful API
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Gửi token lên để backend biết ai đang cập nhật
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Cập nhật thất bại, vui lòng thử lại.');
            }

            // Cập nhật thành công, chuyển hướng về trang chính
            navigate('/courses');
        } catch (err) {
            console.error(err);
            setError('Failed to update profile');
        }


    };

    return (
        <div>
            <h1>Hoàn thiện hồ sơ của bạn</h1>
            <p>Vui lòng điền mật khẩu để hoàn tất đăng ký.</p>
            <form onSubmit={handleSubmitProfile}>
                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};
export default OnboardingPage;