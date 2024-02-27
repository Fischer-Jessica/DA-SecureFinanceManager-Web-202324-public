import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * The root component of the application.
 * Responsible for initializing the application and loading configuration settings.
 * @class AppComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class AppComponent {
  /**
   * The title of the application.
   * Displayed in the browser tab or window title bar.
   */
  title = 'SecureFinanceManager';
}
