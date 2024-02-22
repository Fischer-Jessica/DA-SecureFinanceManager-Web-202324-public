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
   * @param {TranslateService} translate - The TranslateService for translation.
   * @param {SnackBarService} snackBarService - The SnackBarService for displaying snackbar alerts.
   * @memberof RegisterComponent
   */
  constructor(private router: Router,
              private userService: UserService,
              private translate: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Inserts a new user into the API.
   * @returns {void}
   * @memberof RegisterComponent
   */
  insertNewUserInAPI(): void {
    if (this.newUser.username === '' || this.newUser.password === '') {
      this.snackBarService.showAlert(this.translate.instant('authentication.alert_missing_credentials'));
      return;
    }

    // Attempt to register the new user
    this.userService.registerUser(this.newUser).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage');
      },
      error: (err) => {
        this.snackBarService.showAlert(this.translate.instant('alert_error'));
        console.error(this.translate.instant('authentication.register.console_error_register'), err);
      }
    });
  }
}
