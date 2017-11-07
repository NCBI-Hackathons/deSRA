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
// app.component must inject the service
var geneservice_service_1 = require("./geneservice.service");
var AppComponent = (function () {
    // Inject service in AppComponent
    function AppComponent(genesService) {
        this.genesService = genesService;
        this.pageTitle = 'Genes at SRA';
        this.currency = 'USD';
        /*
        genesService.getPrice(this.currency).
            then(price => this.price = price);

        genesService.getGenes();
        */
    }
    AppComponent.prototype.getGenesOutput = function () {
        console.log("test");
        console.log("genesurl: " + this.genesService.genesUrl);
        this.genesService.getGenes();
    };
    AppComponent.prototype.getPriceOutput = function () {
        console.log("test");
        this.genesService.getPrice(this.currency);
    };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'pm-app',
        templateUrl: 'app/app.component.html'
    }),
    __metadata("design:paramtypes", [geneservice_service_1.GenesService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map