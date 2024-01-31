import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/User';
import {map, Observable} from 'rxjs';
import {AppComponent} from '../../app.component';
import {LocalStorageService} from "../LocalStorageService";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  static loggedInUser: User | null = null;
  private readonly localStorageKey = 'loggedInUser';
  loggedInUser: any;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  logIn(username: string, password: string): Observable<User> {
    const apiUrl = AppComponent.apiUrl + 'user';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': 'Basic ' + btoa(username + ':' + password),
    });

    return this.http.get<User>(apiUrl, { headers }).pipe(
      map((result) => {
        UserService.loggedInUser = result;
        localStorage.setItem('loggedInUser', JSON.stringify(result));
        return result;
      })
    );
  }

  signUp(newUser: User) {
    const apiUrl = AppComponent.apiUrl + 'users';

    return this.http.post<User>(apiUrl, newUser, {
      headers: {
        'API-Version': '1',
      },
    }).pipe(
      map((result) => {
        UserService.loggedInUser = newUser;
        UserService.loggedInUser.userId = result.userId;
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        return result;
      })
    );
  }

  updateUser(username: string, password: string, updatedUser: User): Observable<Object> {
    const url = AppComponent.apiUrl + `users`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch(url, updatedUser, {headers});
  }
}
