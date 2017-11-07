/**
 * Created by husainnf on 11/6/2017.
 */
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms'

@Component({
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

}

