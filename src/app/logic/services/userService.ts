import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../models/User";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class UserService {
  loggedInUser: User | null = null;

  constructor(private http: HttpClient) {
  }

  logIn(username: string, password: string): Observable<User> {
    const apiUrl = 'http://localhost:8080/financial-overview/user';

    return this.http.get<User>(apiUrl, {
      params: {
        usernameToValidate: username,
        passwordToValidate: password
      }
    }).pipe(
      map((result) => {
        this.loggedInUser = result;
        return result;
      })
    );
  }

  signUp(user: User) {
    const apiUrl = 'http://localhost:8080/financial-overview/users';

    return this.http.post<number>(apiUrl, {}, {
      params: {
        username: user.username,
        password: user.password,
        eMailAddress: user.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      }
    }).pipe(
      map((result) => {
        this.loggedInUser = user;
        this.loggedInUser.userId = result;
        return result;
      })
    );
  }
}
