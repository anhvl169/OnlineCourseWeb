import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Login from './pages/Login/Login';
import Layout from './pages/Layout/Layout';
import CourseList from './pages/CourseList/CourseList';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminBoard from './pages/AdminDashBoard/AdminBoard';
import TeacherBoard from './pages/TeacherDashBoard/TeacherBoard';
import Cart from './pages/Checkout/Cart';
import { CartProvider } from './context/CartContext';
import AuthCallbackPage from './pages/Login/AuthCallbackPage';
import CourseDetail from './pages/CourseList/CourseDetail';
import Register from './pages/Register/Register';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="App">
          <Routes>
            {/* public route */}

            {/* auth route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/" element={<Layout><CourseList /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            {/* course route */}
            <Route path="/courses/detail/:id" element={<Layout><CourseDetail /></Layout>} />

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
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
