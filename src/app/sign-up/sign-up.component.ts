import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";

interface User {
  username: string;
  password: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
}

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
  }

  constructor(private router: Router, private http: HttpClient) {
  }

  insertNewUserInAPI(): void {
    const apiUrl = 'http://localhost:8080/financial-overview/users';

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const requestBody = {
      username: this.newUser.username,
      password: this.newUser.password,
      eMailAddress: this.newUser.emailAddress,
      firstName: this.newUser.firstName,
      lastName: this.newUser.lastName,
    };

    this.http.post<number>(apiUrl, null, {headers, params: requestBody}).subscribe(
      (response) => {
        console.log('API Response:', response);
      },
      (error) => {
        console.log('Error adding user:', error);
      }
    );

  }

  goToSignIn() {
    this.router.navigateByUrl('/sign-in');
  }
}
