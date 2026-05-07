import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
export default function StudentInCourse() {
    const [students, setStudents] = useState([]);
    const [keyword, setKeyword] = useState("");
    const { id } = useParams();
    const fetchStudents = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/teachers/courses/${id}/students?keyword=${keyword}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setStudents(res.data);
            console.log("Fetched students:", res.data);
        } catch (error) {
            console.error("Fetch students error:", error);
        }
    };
    useEffect(() => {
        if (id) fetchStudents();
    }, [id, keyword]);
    return (
        <div>
            <h2>Student List in Course</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                        </tr>
                    ))}
                    {students.length === 0 && <tr><td colSpan="2">No students found</td></tr>}
                </tbody>
            </table>


        </div >
    );
}