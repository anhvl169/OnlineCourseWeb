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
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const courseres = await axios.get("http://localhost:5000/api/courses");
                setCourses(courseres.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const fetchCate = async () => {
            try {

                const cateres = await axios.get("http://localhost:5000/api/categories");
                setCategories(cateres.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchCate();
    }, []);

    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const instructorres = await axios.get("http://localhost:5000/api/instructors");
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
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "" || course.category_id === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

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
            <div className="row lg-4">
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

        </div>
    );

}