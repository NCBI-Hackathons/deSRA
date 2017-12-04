"use strict";
var CourseModel = (function () {
    function CourseModel(id, year, courseName, grade, selected) {
        this.id = id;
        this.year = year;
        this.courseName = courseName;
        this.grade = grade;
        this.selected = selected;
    }
    return CourseModel;
}());
exports.CourseModel = CourseModel;
//# sourceMappingURL=course.model.js.map