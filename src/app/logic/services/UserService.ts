import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/User";
import {map, Observable} from "rxjs";
import {AppComponent} from "../../app.component";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  static loggedInUser: User | null = null;

  constructor(private http: HttpClient) {
  }

  logIn(username: string, password: string): Observable<User> {
    const apiUrl = AppComponent.apiUrl + 'user';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    return this.http.get<User>(apiUrl, { headers }).pipe(
      map((result) => {
        UserService.loggedInUser = result;
        return result;
      })
    );
  }

  signUp(newUser: User) {
    const apiUrl = AppComponent.apiUrl + 'users';

    return this.http.post<User>(apiUrl, newUser, {
      headers: {
        'API-Version': '1'
      }
    }).pipe(
      map((result) => {
        UserService.loggedInUser = newUser;
        UserService.loggedInUser.userId = result.userId;
        return result;
      })
    );
  }

}
