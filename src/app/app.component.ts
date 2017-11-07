import { Component} from '@angular/core';
// app.component must inject the service
import {GenesService} from "./geneservice.service";

@Component({
    selector: 'pm-app',
    templateUrl: 'app/app.component.html'
})

export class AppComponent {
    pageTitle: string = 'Genes at SRA';
    private currency = 'USD';
    private price: number;

    // Inject service in AppComponent
    constructor(private genesService: GenesService) {
        /*
        genesService.getPrice(this.currency).
            then(price => this.price = price);

        genesService.getGenes();
        */
    }

    getGenesOutput(){
        console.log("test");

        console.log("genesurl: " + this.genesService.genesUrl);
        this.genesService.getGenes();
    }

    getPriceOutput(){
        console.log("test");

        this.genesService.getPrice(this.currency);
    }
}
