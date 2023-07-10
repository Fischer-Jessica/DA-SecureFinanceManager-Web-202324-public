import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  constructor(private router: Router) {
  }

  goToSignIn() {
    this.router.navigateByUrl('/sign-in');
  }
}
