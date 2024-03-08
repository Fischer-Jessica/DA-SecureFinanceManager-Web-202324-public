import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../logic/services/UserService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../logic/services/SnackBarService";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../../app.component.css']
})

/**
 * Component for user login functionality.
 * @class LoginComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class LoginComponent {

  /**
   * The username entered by the user.
   * @type {string}
   */
  username: string = '';

  /**
   * The password entered by the user.
   * @type {string}
   */
  password: string = '';

  /**
   * Creates an instance of LoginComponent.
   * @param {Router} router - The Router service for navigation.
   * @param {UserService} userService - The UserService for user authentication.
   * @param {TranslateService} translateService - The TranslateService for translation.
   * @param {SnackBarService} snackBarService - The SnackBarService for displaying snackbar alerts.
   * @memberof LoginComponent
   */
  constructor(private router: Router,
              private userService: UserService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Logs the user into the overview page.
   * @returns {void}
   * @memberof LoginComponent
   */
  logIntoTheOverview(): void {
    if (!this.username || !this.password) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_missing_credentials'), 'missing');
      return;
    }

    this.userService.getUser(this.username, this.password).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage');
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackBarService.showAlert(this.translateService.instant('authentication.login.alert_wrong_credentials'), 'invalid');
        } else if (err.status === 404) {
          this.snackBarService.showAlert(this.translateService.instant('authentication.login.alert_user_not_found'), 'error');
        } else {
          this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
          console.error(this.translateService.instant('authentication.login.console_error_login'), err);
        }
      }
    });
  }
}
