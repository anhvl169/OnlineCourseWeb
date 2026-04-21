import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './pages/Layout/Layout';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
//auth
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AuthCallbackPage from './pages/Login/AuthCallbackPage';
//course
import CourseList from './pages/Course/CourseList';
import CourseDetail from './pages/Course/CourseDetail';

//profile
import AdminBoard from './pages/AdminDashBoard/AdminBoard';
import TeacherBoard from './pages/TeacherDashBoard/TeacherBoard';
import Profile from './pages/Profile/Profile';

//payment
import Cart from './pages/Checkout/Cart';
import Checkout from './pages/Checkout/Checkout';
import PaymentResult from './pages/Checkout/PaymentResult';





function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <Routes>
            {/* auth route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
              {/* payment route */}
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
            <Route path="/payment-result" element={<PaymentResult />} />
            {/* course route */}
            <Route path="/courses/detail/:id" element={<Layout><CourseDetail /></Layout>} />
            <Route path="/" element={<Layout><CourseList /></Layout>} />
            {/* profile route */}
            <Route element={<ProtectedRoute roles={["student", "teacher", "admin"]} />}>
              <Route path="/profile" element={<Layout><Profile /></Layout>} />
            </Route>
            {/* admin route */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/admin" element={<Layout><AdminBoard /></Layout>} />
            </Route>

            {/* teacher route */}
            <Route element={<ProtectedRoute roles={["teacher", "admin"]} />}>
              <Route path="/teacher" element={<Layout><TeacherBoard /></Layout>} />
            </Route>

            {/* student route */}
            <Route element={<ProtectedRoute roles={["student"]} />}>
              <Route path="/student" element={<Layout><TeacherBoard /></Layout>} />
            </Route>

          </Routes>
        </CartProvider>
      </BrowserRouter >
    </div >
  );
}

export default App;
