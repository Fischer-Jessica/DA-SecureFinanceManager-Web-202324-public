import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SecureFinanceManager';
  public static apiUrl: string = 'http://localhost:8080/secure-finance-manager/';
}
