import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseCard';
import CourseCard from "./CourseCard";
import CourseNav from "./CourseNav";
import Pagination from "../../utils/Pagination";
export default function CourseList() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 8,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    const fetchCourses = async (page) => {
        try {
            const res = await axios.get(
                `http://localhost:5000/api/courses`,
                {
                    params: {
                        page: page,
                        limit: 8,
                        search: searchTerm,
                        category: selectedCategory
                    }
                }
            );

            setCourses(res.data.data);
            setPagination(res.data.pagination);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    useEffect(() => {
        fetchCourses(currentPage);
    }, [currentPage, searchTerm, selectedCategory]);

    useEffect(() => {
        const fetchCate = async () => {
            try {

                const cateData = await axios.get("http://localhost:5000/api/categories");
                setCategories(cateData.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCate();
    }, []);

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const instructorres = await axios.get("http://localhost:5000/api/courses/instructors");
                setInstructors(instructorres.data);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };


        fetchInstructor();
    }, []);

    // Handler for filter changes from CourseNav
    const handleFilterChange = (searchTerm, selectedCategory) => {
        setSearchTerm(searchTerm);
        setSelectedCategory(selectedCategory);
    };

    // Filter courses based on search term and selected category
    const filteredCourses = courses;

    return (
        <div className="container py-5">
            {/* Header Section */}
            <div className="row align-items-center mb-5 py-5">
                <div className="col-md-6">
                    <h2 className="fw-bold mb-0">Khám phá khóa học</h2>
                    <p className="text-muted">Nâng cao kỹ năng với các chuyên gia hàng đầu</p>
                </div>
                <div className="col-md-6 text-md-end">
                    <CourseNav categories={categories} onFilterChange={handleFilterChange} />
                </div>
            </div>
            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
            {/* Courses Grid */}
            <div className="row g-4">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <div className="col-12 col-sm-6 col-lg-3" key={course.course_id}>
                            <CourseCard course={course} instructors={instructors} categories={categories} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" width="100" alt="empty" className="opacity-50 mb-3" />
                        <p className="text-muted">Không tìm thấy khóa học nào phù hợp.</p>
                    </div>
                )}
            </div>

            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    );
}