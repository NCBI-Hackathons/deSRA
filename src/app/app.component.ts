import { Component} from '@angular/core';

@Component({
    selector: 'pm-app',
    template: `
    <div>
        <h1>{{pageTitle}}</h1>
        <h2>Genes at SRA</h2>
        <edu-courses></edu-courses>
     </div>
     `
})

export class AppComponent {
    pageTitle: string = 'Genes at SRA';
}
