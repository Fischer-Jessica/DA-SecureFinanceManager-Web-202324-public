import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../logic/services/UserService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../logic/services/SnackBarService";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
   * @param {TranslateService} translate - The TranslateService for translation.
   * @param {SnackBarService} snackBarService - The SnackBarService for displaying snackbar alerts.
   * @memberof LoginComponent
   */
  constructor(private router: Router,
              private userService: UserService,
              private translate: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Logs the user into the overview page.
   * @returns {void}
   * @memberof LoginComponent
   */
  logIntoTheOverview(): void {
    if (!this.username || !this.password) {
      this.snackBarService.showAlert(this.translate.instant('authorisation.alert_missing_credentials'));
      return;
    }

    this.userService.loginUser(this.username, this.password).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage');
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackBarService.showAlert(this.translate.instant('authorisation.login.alert_wrong_credentials'));
        } else {
          this.snackBarService.showAlert(this.translate.instant('alert_error'));
          console.log(err);
        }
      }
    });
  }
}
