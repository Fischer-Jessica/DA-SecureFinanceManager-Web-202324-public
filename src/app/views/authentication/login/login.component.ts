import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../logic/services/UserService";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';

  password: string = '';

  constructor(private router: Router,
              private userService: UserService,
              private translate: TranslateService,
              private snackBar: MatSnackBar) {
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  logIntoTheOverview(): void {
    this.userService.loginUser(this.username, this.password).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage')
      },
      error: (err) => {
        if (err.status === 401) {
          this.showAlert(this.translate.instant('authorisation.sign-in.alert_wrong_credentials'));
        }
      }
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/authentication/register');
  }
}