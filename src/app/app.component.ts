import { Component} from '@angular/core';
// app.component must inject the service
import {GenesService} from "./geneservice.service";
import {GenesComponent} from "./genes/genes.component";


// directive makes GenesComponent a child component.  Must be made one to use.
@Component({
    selector: 'pm-app',
    templateUrl: 'app/app.component.html'
})

export class AppComponent {
    pageTitle: string = 'Genes at SRA';
    private currency = 'USD';
    private price: number;


    // Inject service in AppComponent
    constructor(private genesService: GenesService, private genesComponent: GenesComponent) {
        /*
        genesService.getPrice(this.currency).
            then(price => this.price = price);

        genesService.getGenes();
        */
    }

    getGenesOutput(){
        console.log("test");

        console.log("Form values in getGenesOutput are and value of genesFormValuesstring: ");

        console.log(this.genesComponent.genesFormValuesstring);

        console.log("genesurl: " + this.genesService.genesUrl);
        // Pass in geneParams

        this.genesService.getGenes();
    }

    getPriceOutput(){
        console.log("test");

        this.genesService.getPrice(this.currency);
    }
}
