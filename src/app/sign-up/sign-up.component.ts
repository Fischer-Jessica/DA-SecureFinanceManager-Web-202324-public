import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../models/user";
import {UserService} from "../services/userService";

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

  constructor(private router: Router, private userService: UserService) {
  }

  insertNewUserInAPI(): void {

    this.userService.signUp(this.newUser).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goToSignIn() {
    this.router.navigateByUrl('/sign-in');
  }
}
