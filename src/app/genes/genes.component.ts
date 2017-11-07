/**
 * Created by husainnf on 11/6/2017.
 */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'



@Component({
    selector: 'genes-output',
    templateUrl: 'app/genes/genes.component.html'
})

export class GenesComponent implements OnInit {
    public accessionsArray : any[] = [];


    constructor() {

    }

    ngOnInit() {
        // set ids before adding new row
        //this.setIDs();
    }

    submitForm(form: NgForm) {
         // Behind the scenes model
         console.log(form.value);
    }


}

