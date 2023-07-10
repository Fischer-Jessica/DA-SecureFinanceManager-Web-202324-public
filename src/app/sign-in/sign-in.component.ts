import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  constructor(private router: Router) {
  }

  goToSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
}
