import { Component, OnInit } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { NgForm } from '@angular/forms'

@Component({
    selector: 'edu-courses',
    templateUrl: 'app/courses/courses.component.html'
})

export class CoursesComponent implements OnInit{
   // for new way
   rows: any[] = [];
   editRowId: any;
   // can only use *ngIf and *ngFor on Arrays
   //cwArray = [this.cwmodel];
   public cwArray : any[] = [];
   //private editing:boolean = false;
   public cwmodel: any;

   public courses: any[] = [];
   degreetypes: any[];
   pageTitle: string;

   public selectedAll: any;

   constructor() {
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
 
      
      this.cwmodel = new CourseModel(1,"", "", "", true);
   }
          

      submitForm(form: NgForm) {
         console.log(this.cwmodel);
         // Behind the scenes model
         console.log(form.value);
         this.cwArray.push(form.value);
         console.log(this.cwArray);

      }

      /** ids are used in the coursework section for displayin the row being editing as textboxes.  ids are also used as labels for the checkboxes */
      setIDs() {
         for (var i = 0; i < this.cwArray.length; i++) {
           this.cwArray[i].id = i+1;
        }
      }

      ngOnInit() {
          // set ids before adding new row
          this.setIDs();
      }

      addNewRow(form: NgForm) {
          //this.editing = true;
          // reset id's before adding new row
          this.setIDs();

          let indexForId = this.cwArray.length+1;
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
          setTimeout(function() {
            document.getElementById("courseinput").focus();
          },500);
      
          // this.cwArray.push(form.value);
          //form.value.year = "";
      }

      remove = function() {
	        var newDataList: any[] = [];
	        this.selectedAll = false;
	        for (let item of this.cwArray) {
            // push all the items to the list that are not selected
	          if(!item.selected){
	            newDataList.push(item);
	          }
	        }; 
	        this.cwArray = newDataList;
	    };

      checkAll() {
        if (this.selectedAll) {
            this.selectedAll = true;
        } else {
            this.selectedAll = false;
        }
        for (var i = 0; i < this.cwArray.length; i++) {
           this.cwArray[i].selected = this.selectedAll;
           console.log("selected value is: " + this.cwArray[i].selected);
        }
      }

      
      // Method to display the editable value as text and emit save event to host
      addCourse(form: NgForm){
         console.log(this.cwmodel);
         // Behind the scenes model
         console.log(form.value);
         form.value.isEditable  = false;
         console.log(form.value);
         this.cwArray.pop();
         this.cwArray.push(form.value);
         //this.editing = false;
          
         console.log("cwarray is:");
         for (var i = 0; i < this.cwArray.length; i++) {
            console.log(this.cwArray[i]);
         }
      }

      // Method to reset the editable value
      cancel(form: NgForm){
          //this._value = this.preValue;
          //this.editing = false;
          //form.value.isEditable  = false;
      }

      toggle(val: number){
        console.log("toggle called");
        this.editRowId = val;
        /*if (form.value.isEditable = false) {
          form.value.isEditable  = true;
        } else {
          form.value.isEditable = false;
        }*/
      }

/**
      firstNameToUpperCase(value: string) {
        if (value.length > 0)
           this.cwmodel.firstName = value.charAt(0).toUpperCase() + value.slice(1);
        else
           this.cwmodel.firstName = value;
      }
*/

}