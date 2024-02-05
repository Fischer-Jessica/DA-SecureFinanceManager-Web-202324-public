import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../../logic/models/User";
import {UserService} from "../../../logic/services/UserService";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  newUser: User = {
    username: '',
    password: '',
    emailAddress: undefined,
    firstName: undefined,
    lastName: undefined,
  };

  constructor(private router: Router,
              private userService: UserService,
              private translate: TranslateService) {
  }

  insertNewUserInAPI(): void {
    this.userService.registerUser(this.newUser).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage')
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl('/authentication/login');
  }
}
