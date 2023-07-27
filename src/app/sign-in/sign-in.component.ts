import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/userService";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  username: string = '';

  password: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private translate: TranslateService) {
    translate.addLangs(['en', 'de'])
    translate.setDefaultLang('en');
    translate.use('de');
  }

  logIntoTheOverview(): void {
    this.userService.logIn(this.username, this.password).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('/logged-in-homepage')
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goToSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
}
