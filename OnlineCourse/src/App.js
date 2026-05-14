import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
import UserProfile from './pages/UserProfile/UserProfile';
//payment
import Cart from './pages/Checkout/Cart';
import Checkout from './pages/Checkout/Checkout';
import PaymentResult from './pages/Checkout/PaymentResult';

//chat
import ChatPage from './pages/Chat/ChatPage';
//dashboard
import StudentInCourse from './components/Dashboard/StudentInCourse';
import CourseByTeacher from './components/Dashboard/CourseByTeacher';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppProvider>
          <Routes>

            {/* chat */}
            <Route path="/chat" element={<Layout><ChatPage /></Layout>} />

            {/* user profile */}
            <Route path="/users/:id" element={<Layout><UserProfile /></Layout>} />

            {/* auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* payment */}
            <Route
              path="/cart"
              element={<Layout><Cart /></Layout>}
            />

            <Route
              path="/checkout"
              element={<Layout><Checkout /></Layout>}
            />

            <Route
              path="/payment-result"
              element={<PaymentResult />}
            />

            {/* course */}
            <Route
              path="/courses/detail/:id"
              element={<Layout><CourseDetail /></Layout>}
            />

            <Route
              path="/"
              element={<Layout><CourseList /></Layout>}
            />

            {/* profile */}
            <Route
              element={
                <ProtectedRoute
                  roles={["student", "teacher", "admin"]}
                />
              }
            >
              <Route
                path="/profile"
                element={<Layout><Profile /></Layout>}
              />
            </Route>

            {/* admin */}
            <Route
              element={
                <ProtectedRoute roles={["admin"]} />
              }
            >
              <Route
                path="/admin"
                element={<Layout><AdminBoard /></Layout>}
              />
            </Route>

            {/* teacher */}
            <Route
              element={
                <ProtectedRoute
                  roles={["teacher", "admin"]}
                />
              }
            >
              <Route
                path="/teachers"
                element={<Layout><TeacherBoard /></Layout>}
              />

              <Route
                path="/teachers/courses/:id/students"
                element={<Layout><StudentInCourse /></Layout>}
              />

              <Route
                path="/teachers/courses"
                element={<Layout><CourseByTeacher /></Layout>}
              />
            </Route>

          </Routes>
        </AppProvider>
      </BrowserRouter>
    </div >
  );
}

export default App;
