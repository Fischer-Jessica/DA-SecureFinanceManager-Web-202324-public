import { Component } from '@angular/core';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent {
  // define the array
  userTableData = [
    {id: 0, username: "Test", password: "Test", email: "Test@gmail.com"}
  ]
}
