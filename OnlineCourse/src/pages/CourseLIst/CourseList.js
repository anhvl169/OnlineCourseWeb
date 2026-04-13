import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './CourseCard';
import CourseCard from "./CourseCard";
import CourseNav from "./CourseNav";
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
        <div className="container">
            <h1>Course List</h1>

            {/* Course Navigation with Search and Filter */}
            <CourseNav categories={categories} onFilterChange={handleFilterChange} />

            {/* Results Count */}
            <div className="mb-3">
                <p className="text-muted">Showing {filteredCourses.length} course(s)</p>
            </div>

            {/* Courses Grid */}
            <div className="row">
                {
                    filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <div className="col-md-3" key={course.course_id}>
                                <CourseCard course={course} instructors={instructors} categories={categories} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <p className="text-center text-muted">No courses found matching your search criteria.</p>
                        </div>
                    )
                }
            </div>

            <div className="d-flex justify-content-center mt-4 gap-2">

                <button
                    className="btn btn-secondary"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    Prev
                </button>

                <span className="align-self-center">
                    Page {currentPage} / {pagination.totalPages}
                </span>

                <button
                    className="btn btn-primary"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    Next
                </button>

            </div>

        </div>
    );

}