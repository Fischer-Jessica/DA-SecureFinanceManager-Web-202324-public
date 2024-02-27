import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * The root component of the application.
 * Responsible for initializing the application and loading configuration settings.
 * @class AppComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class AppComponent implements OnInit {
  /**
   * The title of the application.
   * Displayed in the browser tab or window title bar.
   */
  title = 'SecureFinanceManager';

  /**
   * The base URL for the API endpoint.
   * Used for making HTTP requests to the backend server.
   */
  public static apiUrl: string;

  /**
   * Creates an instance of AppComponent.
   * @param http The HttpClient module for making HTTP requests.
   * @memberof AppComponent
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Invoked immediately after the first ngOnChanges().
   * @memberof AppComponent
   */
  ngOnInit() {
    this.loadConfig();
  }

  /**
   * Loads the application configuration from the `config.json` file.
   * Updates the API URL based on the loaded configuration.
   * @memberof AppComponent
   */
  loadConfig() {
    this.http.get<any>('assets/config.json').subscribe(config => {
      AppComponent.apiUrl = config.apiUrl;
    });
  }
}
