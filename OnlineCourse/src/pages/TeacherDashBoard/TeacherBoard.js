import { getUserFromToken } from "../../utils/authUtils";
import CourseByTeacher from "../../components/Dashboard/CourseByTeacher";
import StudentInCourse from "../../components/Dashboard/StudentInCourse";
import { useState } from "react";
export default function TeacherBoard() {
    const [activeTab, setActiveTab] = useState("courses");
    const user = getUserFromToken();
    return (
        <div className="container mt-4">
            <h1>Teacher {user.name} Dashboard</h1>
            <p>Welcome to the teacher dashboard! Here you can manage your courses and students.</p>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "courses" ? "active" : ""}`}
                        onClick={() => setActiveTab("courses")}
                    >
                        Courses
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "students" ? "active" : ""}`}
                        onClick={() => setActiveTab("students")}
                    >
                        Students
                    </button>
                </li>
            </ul>
            {activeTab === "courses" && <CourseByTeacher />}
            {activeTab === "students" && <StudentInCourse />}
        </div>
    );
}