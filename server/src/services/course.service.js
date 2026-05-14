const { getRecommendCourses } = require('./../repositories/course.repo');
const { extractSkills } = require("./aiKeyword.service");
const searchCourses = async (message) => {
    const aiData =
        await extractSkills(message);
    const skills = aiData.skills || [];
    return await getRecommendCourses(skills);
};

module.exports = {
    searchCourses
};