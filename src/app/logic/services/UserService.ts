import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/User';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppComponent} from '../../app.component';

@Injectable({
  providedIn: 'root',
})
/**
 * Service to interact with user-related API endpoints.
 * @class UserService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class UserService {
  /**
   * Creates an instance of UserService.
   * @param {HttpClient} http - The HttpClient instance used for HTTP requests.
   * @memberof UserService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Logs in a user with the provided username and password.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Observable<User>} An observable of the logged-in user.
   */
  loginUser(username: string, password: string): Observable<User> {
    const apiUrl = AppComponent.apiUrl + 'user';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': 'Basic ' + btoa(username + ':' + password),
    });

    return this.http.get<User>(apiUrl, {headers}).pipe(
      map((result) => {
        result.password = password;
        localStorage.setItem('loggedInUser', JSON.stringify(result));
        return result;
      })
    );
  }

  /**
   * Registers a new user.
   * @param {User} newUser - The user object to register.
   * @returns {Observable<User>} An observable of the registered user.
   */
  registerUser(newUser: User): Observable<User> {
    const apiUrl = AppComponent.apiUrl + 'users';

    return this.http.post<User>(apiUrl, newUser, {
      headers: {
        'API-Version': '1',
      },
    }).pipe(
      map((result) => {
        result.password = newUser.password;
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        return result;
      })
    );
  }

  /**
   * Updates an existing user.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {User} updatedUser - The updated user object.
   * @returns {Observable<User>} An observable of the updated user.
   */
  updateUser(username: string, password: string, updatedUser: User): Observable<User> {
    const url = AppComponent.apiUrl + `users`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch<User>(url, updatedUser, {headers}).pipe(
      map((result) => {
        result.password = updatedUser.password;
        localStorage.setItem('loggedInUser', JSON.stringify(result));
        return result;
      })
    );
  }

  /**
   * Deletes a user.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Observable<number>} An observable indicating the success of deletion.
   */
  deleteUser(username: string, password: string): Observable<number> {
    const url = AppComponent.apiUrl + `users`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.delete<number>(url, {headers});
  }
}
