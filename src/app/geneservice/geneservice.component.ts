/**
 * Created by husainnf on 11/6/2017.
 */
import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms'
import {GenesComponent} from "../genes/genes.component";

@Component({
    templateUrl: 'app/geneservice/geneservice.component.html'
})

@Injectable()
export class GenesserviceComponent implements OnInit {

    // can only use *ngIf and *ngFor on Arrays

    public genes: any[] = [];

    pageTitle: string;

    private http: Http;
    genesUrl = "https://trace.ncbi.nlm.nih.gov/Traces/sra/";

    constructor(){

        this.pageTitle = 'Genes from SRA';

        this.genes = [];
    }



    ngOnInit(){
        // set ids before adding new row
        //this.setIDs();
    }


    // with Observable
    //getGenes(): Observable<GenesComponent[]> {
        //return this.http.get<GenesComponent[]>(this.genesUrl, {params: {'sp': 'runinfo', 'acc': 'SRR5970434'}})
    //    return this.http.get<GenesComponent[]>(this.genesUrl)
    //}

    // without Observable
    getGenes() {
        //return this.http.get<GenesComponent[]>(this.genesUrl, {params: {'sp': 'runinfo', 'acc': 'SRR5970434'}})
        return this.http.get(this.genesUrl, {params: {'sp': 'runinfo', 'acc': 'SRR5970434'}})

    }
}