import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../../logic/models/User";
import {UserService} from "../../../logic/services/UserService";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
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
    this.userService.signUp(this.newUser).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage')
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goToSignIn() {
    this.router.navigateByUrl('/authentication/sign-in');
  }
}
