import {Component, OnInit} from '@angular/core';
import {User} from "../../../logic/models/User";
import {UserService} from "../../../logic/services/UserService";
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../logic/services/SnackBarService";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css', '../logged-in-homepage.component.css']
})

/**
 * Component for managing user information and actions in the logged-in homepage.
 * Handles fetching, updating, and deleting user data, as well as logging out the user.
 * @class UserComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class UserComponent implements OnInit {
  /**
   * Represents the current user.
   * @type {User}
   */
  protected user: User = {} as User;

  /**
   * Represents the original user data before any modifications.
   * @type {User}
   */
  protected originalUser: User = {} as User;

  /**
   * Creates an instance of UserComponent.
   * @param {UserService} userService - The UserService for managing user data.
   * @param {Router} router - The Router service for navigation.
   * @param {LocalStorageService} localStorageService - The LocalStorageService for storing user data.
   * @param {TranslateService} translate - The TranslateService for localization.
   * @param {SnackBarService} snackBarService - The SnackBarService for displaying alerts.
   * @memberof UserComponent
   */
  constructor(private userService: UserService,
              private router: Router,
              private localStorageService: LocalStorageService,
              private translate: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Calls the fetchUser method to fetch user data when the component is initialized.
   * @memberof UserComponent
   */
  ngOnInit(): void {
    this.fetchUser();
  }

  /**
   * Fetches user data from the backend API and updates the user object.
   * Shows appropriate alerts and navigates to login page if user is not logged in or encounters errors.
   * @memberof UserComponent
   */
  fetchUser(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userService.loginUser(this.user.username, this.user.password).subscribe(
        loggedInUser => {
          this.localStorageService.setItem('loggedInUser', JSON.stringify(loggedInUser));
          this.user = loggedInUser;
          this.originalUser = {...this.user};
        },
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translate.instant('authentication.alert_user_not_logged_in'));
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigate(['/authentication/login']);
          } else {
            this.snackBarService.showAlert(this.translate.instant('alert_error'));
            console.error(this.translate.instant('logged-in-homepage.user.console_error_fetching_user'), error);
          }
        }
      );
    } else {
      this.snackBarService.showAlert(this.translate.instant('authentication.alert_user_not_logged_in'));
      this.router.navigate(['/authentication/login']);
    }
  }

  /**
   * Deletes the user account after confirmation.
   * Shows appropriate alerts and navigates to login page if user is not logged in or encounters errors.
   * @memberof UserComponent
   */
  deleteUser() {
    const confirmDelete = confirm(this.translate.instant('logged-in-homepage.user.alert_confirm_delete_user'));
    if (!confirmDelete) {
      return;
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translate.instant('authentication.alert_user_not_logged_in'));
      this.router.navigate(['/authentication/login']);
      return;
    }

    const loggedInUser: User = JSON.parse(storedUser);
    this.userService.deleteUser(
      loggedInUser.username,
      loggedInUser.password
    ).subscribe(
      () => {
        this.localStorageService.removeItem('loggedInUser');
        this.router.navigate(['/authentication/register']);
      },
      error => {
        if (error.status === 401) {
          this.snackBarService.showAlert(this.translate.instant('authentication.alert_user_not_logged_in'));
          this.localStorageService.removeItem('loggedInUser');
          this.router.navigate(['/authentication/login']);
        } else {
          this.snackBarService.showAlert(this.translate.instant('alert_error'));
          console.error(this.translate.instant('logged-in-homepage.user.console_error_deleting_user'), error);
        }
      }
    );
  }

  /**
   * Handles form submission to update user data.
   * Shows appropriate alerts and navigates to login page if user is not logged in or encounters errors.
   * @param {any} formData - The form data submitted by the user.
   * @memberof UserComponent
   */
  onSubmit(formData: any): void {
    if (!formData.valid) {
      this.snackBarService.showAlert(this.translate.instant('logged-in-homepage.alert_invalid_formData'));
      return;
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert('authentication.alert_user_not_logged_in');
      this.router.navigate(['/authentication/login']);
      return;
    }

    const loggedInUser: User = JSON.parse(storedUser);
    this.userService.updateUser(
      loggedInUser.username,
      loggedInUser.password,
      this.user
    ).subscribe(
      updatedUser => {
        updatedUser.password = this.user.password;
        this.localStorageService.setItem('loggedInUser', JSON.stringify(updatedUser));
      },
      error => {
        if (error.status === 401) {
          this.snackBarService.showAlert(this.translate.instant('authentication.alert_user_not_logged_in'));
          this.localStorageService.removeItem('loggedInUser');
          this.router.navigate(['/authentication/login']);
        } else {
          this.snackBarService.showAlert(this.translate.instant('alert_error'));
          console.error(this.translate.instant('logged-in-homepage.user.console_error_updating_user'), error);
        }
      }
    );
  }

  /**
   * Logs out the user by removing user data from local storage and navigating to the login page.
   * @memberof UserComponent
   */
  logout() {
    this.localStorageService.removeItem('loggedInUser');
    this.router.navigate(['/authentication/login']);
  }
}
