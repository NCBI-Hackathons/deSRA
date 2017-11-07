import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { FormsModule } from "@angular/forms";

import { CoursesComponent } from './courses/courses.component';
import { CourseworkListComponent } from './coursework/coursework-list.component';

import { AppComponent }  from './app.component';

import {GenesComponent} from "./genes/genes.component";
import {GenesserviceComponent} from "./geneservice/geneservice.component";


@NgModule({
  imports: [ BrowserModule, HttpModule, FormsModule ],
  declarations: [ AppComponent,
                  CoursesComponent,
                  CourseworkListComponent,
                  GenesComponent,
                  GenesserviceComponent],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
