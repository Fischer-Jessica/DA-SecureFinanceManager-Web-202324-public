import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../../logic/models/User";
import {UserService} from "../../../logic/services/UserService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../logic/services/SnackBarService";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

/**
 * Component for user registration functionality.
 * @class RegisterComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class RegisterComponent {
  /**
   * Represents a new user being registered.
   * @type {User}
   */
  newUser: User = {
    username: '',
    password: '',
    emailAddress: undefined,
    firstName: undefined,
    lastName: undefined,
  };

  /**
   * Creates an instance of RegisterComponent.
   * @param {Router} router - The Router service for navigation.
   * @param {UserService} userService - The UserService for user registration.
   * @param {TranslateService} translateService - The TranslateService for translation.
   * @param {SnackBarService} snackBarService - The SnackBarService for displaying snackbar alerts.
   * @memberof RegisterComponent
   */
  constructor(private router: Router,
              private userService: UserService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Inserts a new user into the API.
   * @returns {void}
   * @memberof RegisterComponent
   */
  insertNewUser(): void {
    if (this.newUser.username === '' || this.newUser.password === '') {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_missing_credentials'));
      return;
    }

    this.userService.insertUser(this.newUser).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage');
      },
      error: (err) => {
        if (err.status === 400) {
          this.snackBarService.showAlert(this.translateService.instant('authentication.alert_missing_credentials'));
        } else {
          this.snackBarService.showAlert(this.translateService.instant('alert_error'));
          console.error(this.translateService.instant('authentication.register.console_error_register'), err);
        }
      }
    });
  }
}
