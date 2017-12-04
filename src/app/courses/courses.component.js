"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var course_model_1 = require("../models/course.model");
var CoursesComponent = (function () {
    function CoursesComponent() {
        // for new way
        this.rows = [];
        // can only use *ngIf and *ngFor on Arrays
        //cwArray = [this.cwmodel];
        this.cwArray = [];
        this.courses = [];
        this.remove = function () {
            var newDataList = [];
            this.selectedAll = false;
            for (var _i = 0, _a = this.cwArray; _i < _a.length; _i++) {
                var item = _a[_i];
                // push all the items to the list that are not selected
                if (!item.selected) {
                    newDataList.push(item);
                }
            }
            ;
            this.cwArray = newDataList;
        };
        this.pageTitle = 'Coursework List';
        this.courses = [
            {
                "year": 1999,
                "courseName": "Biology",
                "grade": "A"
            },
            {
                "year": 2001,
                "courseName": "Chemistry",
                "grade": "A"
            },
            {
                "year": 2003,
                "courseName": "Python Programming",
                "grade": "A"
            }
        ];
        this.degreetypes = ['Doctor of Philosophy (PhD)', 'Master of Science (MS)', 'Bachelor of Science (BS)'];
        this.cwmodel = new course_model_1.CourseModel(1, "", "", "", true);
    }
    CoursesComponent.prototype.submitForm = function (form) {
        console.log(this.cwmodel);
        // Behind the scenes model
        console.log(form.value);
        this.cwArray.push(form.value);
        console.log(this.cwArray);
    };
    /** ids are used in the coursework section for displayin the row being editing as textboxes.  ids are also used as labels for the checkboxes */
    CoursesComponent.prototype.setIDs = function () {
        for (var i = 0; i < this.cwArray.length; i++) {
            this.cwArray[i].id = i + 1;
        }
    };
    CoursesComponent.prototype.ngOnInit = function () {
        // set ids before adding new row
        this.setIDs();
    };
    CoursesComponent.prototype.addNewRow = function (form) {
        //this.editing = true;
        // reset id's before adding new row
        this.setIDs();
        var indexForId = this.cwArray.length + 1;
        console.log("indexForId is: " + indexForId);
        this.cwArray.push({
            id: indexForId,
            year: '',
            courseName: '',
            grade: '',
            selected: true
        });
        // select new editable textbox
        this.toggle(indexForId);
        // add delay because the input takes time to appear
        setTimeout(function () {
            document.getElementById("courseinput").focus();
        }, 500);
        // this.cwArray.push(form.value);
        //form.value.year = "";
    };
    CoursesComponent.prototype.checkAll = function () {
        if (this.selectedAll) {
            this.selectedAll = true;
        }
        else {
            this.selectedAll = false;
        }
        for (var i = 0; i < this.cwArray.length; i++) {
            this.cwArray[i].selected = this.selectedAll;
            console.log("selected value is: " + this.cwArray[i].selected);
        }
    };
    // Method to display the editable value as text and emit save event to host
    CoursesComponent.prototype.addCourse = function (form) {
        console.log(this.cwmodel);
        // Behind the scenes model
        console.log(form.value);
        form.value.isEditable = false;
        console.log(form.value);
        this.cwArray.pop();
        this.cwArray.push(form.value);
        //this.editing = false;
        console.log("cwarray is:");
        for (var i = 0; i < this.cwArray.length; i++) {
            console.log(this.cwArray[i]);
        }
    };
    // Method to reset the editable value
    CoursesComponent.prototype.cancel = function (form) {
        //this._value = this.preValue;
        //this.editing = false;
        //form.value.isEditable  = false;
    };
    CoursesComponent.prototype.toggle = function (val) {
        console.log("toggle called");
        this.editRowId = val;
        /*if (form.value.isEditable = false) {
          form.value.isEditable  = true;
        } else {
          form.value.isEditable = false;
        }*/
    };
    return CoursesComponent;
}());
CoursesComponent = __decorate([
    core_1.Component({
        selector: 'edu-courses',
        templateUrl: 'app/courses/courses.component.html'
    }),
    __metadata("design:paramtypes", [])
], CoursesComponent);
exports.CoursesComponent = CoursesComponent;
//# sourceMappingURL=courses.component.js.map