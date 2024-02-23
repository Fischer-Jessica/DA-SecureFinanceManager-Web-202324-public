import {Component} from '@angular/core';

/**
 * The root component of the Angular application.
 * This component represents the root of the application's view hierarchy.
 * It contains the main layout and is responsible for bootstrapping the application.
 * @class AppComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /**
   * The base URL for the API endpoint.
   * Used for making HTTP requests to the backend server.
   */
  public static apiUrl: string = 'http://localhost:8080/secure-finance-manager/';
  /**
   * The title of the application.
   * Displayed in the browser tab or window title bar.
   */
  title = 'SecureFinanceManager';
}
