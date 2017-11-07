import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { FormsModule } from "@angular/forms";

import { CoursesComponent } from './courses/courses.component';
import { CourseworkListComponent } from './coursework/coursework-list.component';

import { AppComponent }  from './app.component';

import {GenesComponent} from "./genes/genes.component";

import {GenesService} from "./geneservice.service";


@NgModule({
  imports: [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ AppComponent,
                  CoursesComponent,
                  CourseworkListComponent,
                  GenesComponent],
  providers: [GenesService],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
