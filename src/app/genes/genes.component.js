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
/**
 * Created by husainnf on 11/6/2017.
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var GenesComponent = (function () {
    function GenesComponent(http) {
        this.http = http;
        this.genesArray = [];
    }
    GenesComponent.prototype.ngOnInit = function () {
        // set ids before adding new row
        //this.setIDs();
    };
    GenesComponent.prototype.submitForm = function (form) {
        // Behind the scenes model
        console.log("form values");
        console.log(form.value);
        //this.genesFormValues = form.value;
        // now use JSON.stringify() to convert form values to json
        this.genesFormValuesstring = JSON.stringify(form.value);
        console.log("genes form values:");
        console.log(this.genesFormValuesstring);
        if (typeof (Storage) !== "undefined") {
            // Store
            localStorage.setItem("genesformvalues", this.genesFormValuesstring);
        }
    };
    GenesComponent.prototype.getFormValuesJSON = function () {
        return this.genesFormValuesstring;
    };
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
    GenesComponent.prototype.fileChanged = function (e) {
        var target = e.target;
        for (var i = 0; i < target.files.length; i++) {
            this.upload(target.files[i]);
        }
    };
    GenesComponent.prototype.upload = function (img) {
        var formData = new FormData();
        formData.append("image", img, img.name);
        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (ev) {
            //You can handle progress events here if you want to track upload progress (I used an observable<number> to fire back updates to whomever called this upload)
        });
        xhr.open("PUT", "data/gene", true);
        xhr.send(formData);
    };
    return GenesComponent;
}());
GenesComponent = __decorate([
    core_1.Component({
        selector: 'genes-output',
        templateUrl: 'app/genes/genes.component.html'
    }),
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], GenesComponent);
exports.GenesComponent = GenesComponent;
//# sourceMappingURL=genes.component.js.map