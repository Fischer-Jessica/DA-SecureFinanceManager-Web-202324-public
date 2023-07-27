import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../services/userService";


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
    private userService: UserService) {
  }

  logIntoTheOverview(): void {
    this.userService.logIn(this.username, this.password).subscribe({
      next: (response) => {
        console.log(response);
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
