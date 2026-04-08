import { getUserFromToken, getUserRole } from "../../utils/authUtils";
export default function TeacherBoard() {
    const user = getUserFromToken();
    return (
        <div className="container mt-4">
            <h1>Teacher {user.name} Dashboard</h1>
            <p>Welcome to the teacher dashboard! Here you can manage your courses and students.</p>
        </div>
    );
}