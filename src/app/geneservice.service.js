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
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var GenesService = (function () {
    // Inject http here
    function GenesService(http) {
        this.http = http;
        // can only use *ngIf and *ngFor on Arrays
        this.genes = [];
        this.genesUrl = "http://trace.ncbi.nlm.nih.gov/Traces/sra/";
        //this.http.get(this.genesUrl, {params: {'sp': 'runinfo', 'acc': 'SRR5970434'}});
        //this.http.get(this.genesUrl);
        this.currentPriceUrl = 'http://api.coindesk.com/v1/bpi/currentprice.json';
        this.pageTitle = 'Genes from SRA';
        this.genes = [];
        //console.log("Form values are: ");
        //console.log(genesComponent.genesFormValues);
    }
    GenesService.prototype.ngOnInit = function () {
        // set ids before adding new row
        //this.setIDs();
        //this.getGenes();
    };
    // with Observable
    //getGenes(): Observable<GenesComponent[]> {
    //return this.http.get<GenesComponent[]>(this.genesUrl, {params: {'sp': 'runinfo', 'acc': 'SRR5970434'}})
    //    return this.http.get<GenesComponent[]>(this.genesUrl)
    //}
    // without Observable
    GenesService.prototype.getGenes = function () {
        //console.log("Form values in getGenes are: ");
        //console.log(this.genesComponent.getFormValuesJSON);
        if (typeof (Storage) !== "undefined") {
            // Store
            console.log("genesformvalues to pass in are: ");
            console.log(localStorage.getItem("genesformvalues"));
        }
        console.log("genesurl in getGenes is: " + this.genesUrl);
        //return this.http.get<GenesComponent[]>(this.genesUrl, {params: {'sp': 'runinfo', 'acc': 'SRR5970434'}}).toPromise();
        //return this.http.post(this.genesUrl, {params: {'sp': 'runinfo', 'acc': 'SRR5970434'}}).toPromise();
        return this.http.post(this.genesUrl, { params: localStorage.getItem("genesformvalues") }).toPromise();
    };
    ;
    GenesService.prototype.getPrice = function (currency) {
        return this.http.get(this.currentPriceUrl).toPromise()
            .then(function (response) { return response.json().bpi[currency].rate; });
    };
    return GenesService;
}());
GenesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], GenesService);
exports.GenesService = GenesService;
//# sourceMappingURL=geneservice.service.js.map