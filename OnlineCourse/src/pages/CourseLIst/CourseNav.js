import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CourseNav({ categories, onFilterChange }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onFilterChange(term, selectedCategory);
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        onFilterChange(searchTerm, category);
    };

    return (
        <div className="row mb-4 mt-4">
            <div className="col-md-6">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search courses by name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="col-md-6">
                <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
