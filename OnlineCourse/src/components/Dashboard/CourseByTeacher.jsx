import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function CourseByTeacher() {
    const [courses, setCourses] = useState([]);
    const { id } = useParams();
    const fetchCourses = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/teachers/courses/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setCourses(res.data);
        } catch (error) {
            console.error("Fetch courses error:", error);
        }
    };
    useEffect(() => {
        if (id) fetchCourses();
    }, [id]);
    return (
        <div>
            <h2>Course</h2>
            {/* Implement course list display here */}
        </div>
    );
}