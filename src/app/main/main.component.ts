import { Component } from '@angular/core';
import { UsertableComponent } from '../usertable/usertable.component'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  template: `
    <h1>Users</h1>
    <app-usertable></app-usertable>
  `
})
export class MainComponent {

}
