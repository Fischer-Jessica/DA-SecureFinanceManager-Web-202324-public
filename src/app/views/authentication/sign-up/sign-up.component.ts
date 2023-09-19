import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../../logic/models/User";
import {UserService} from "../../../logic/services/userService";
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
    emailAddress: '',
    firstName: '',
    lastName: '',
  };

  constructor(private router: Router,
              private userService: UserService,
              private translate: TranslateService) {
    translate.addLangs(['en', 'de'])
    translate.setDefaultLang('en');
    translate.use('en');
  }

  insertNewUserInAPI(): void {

    this.userService.signUp(this.newUser).subscribe({
      next: (response) => {
        console.log(response);
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
