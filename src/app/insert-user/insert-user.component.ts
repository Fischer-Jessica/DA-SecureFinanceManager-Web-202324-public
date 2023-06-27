import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

interface User {
  username: string;
  password: string;
  email: string;
}

@Component({
  selector: 'app-insert-user',
  templateUrl: './insert-user.component.html',
  styleUrls: ['./insert-user.component.css']
})
export class InsertUserComponent {
  user: User = {
    username: '',
    password: '',
    email: ''
  };

  constructor(private http: HttpClient) {}

  sendObjectToAPI(): void {
    const apiUrl = 'http://localhost:8080/usermanagement/users';

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const requestBody = {
      username: this.user.username,
      password: this.user.password,
      email: this.user.email
    };

    this.http.post<User>(apiUrl, null, { headers, params: requestBody }).subscribe(
      (response) => {
        console.log('Object sent successfully:', response);
        // Handle the response from the API if needed
      },
      (error) => {
        console.log('Error sending object:', error);
        // Handle the error response if needed
      }
    );
  }
}
