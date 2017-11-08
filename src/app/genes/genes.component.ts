/**
 * Created by husainnf on 11/6/2017.
 */
import {Component, OnInit, Injectable} from '@angular/core';
import { NgForm } from '@angular/forms'

import { Http, Response } from '@angular/http';

@Component({
    selector: 'genes-output',
    templateUrl: 'app/genes/genes.component.html'
})

@Injectable()
export class GenesComponent implements OnInit {
    public genesArray : any[] = [];

    public genesFormValuesstring : string;


    constructor(private http: Http){

    }

    ngOnInit() {
        // set ids before adding new row
        //this.setIDs();
    }

    submitForm(form: NgForm) {
         // Behind the scenes model
        console.log("form values");
        console.log(form.value);
        //this.genesFormValues = form.value;
        // now use JSON.stringify() to convert form values to json
        this.genesFormValuesstring = JSON.stringify(form.value);
        console.log("genes form values:");
        console.log(this.genesFormValuesstring);
        if (typeof(Storage) !== "undefined") {
            // Store
            localStorage.setItem("genesformvalues", this.genesFormValuesstring);
        }

    }

    getFormValuesJSON() {
        return this.genesFormValuesstring;
    }
/*
fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        let headers = new Headers();
        */
        /** No need to include Content-Type in Angular 4 */
        /*
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        this.http.post(`${this.apiEndPoint}`, formData, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            )
    }
}*/

fileChanged(e: Event) {
    var target: HTMLInputElement = e.target as HTMLInputElement;
    for(var i=0;i < target.files.length; i++) {
        this.upload(target.files[i]);
    }
}

upload(img: File) {
    var formData: FormData = new FormData();
    formData.append("image", img, img.name);

    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (ev: ProgressEvent) => {
        //You can handle progress events here if you want to track upload progress (I used an observable<number> to fire back updates to whomever called this upload)
    });
    xhr.open("PUT", "data/gene", true);
    xhr.send(formData);
}
}

