import {Injectable} from "@angular/core";
import {Label} from "../models/Label";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {AppComponent} from "../../app.component";

@Injectable({
  providedIn: 'root'
})

export class LabelService {
  labels: Label[] | null = null;

  constructor(private http: HttpClient) {
  }

  getLabels(userId: number, username: string, password: string, eMailAddress: string, firstName: string, lastName: string): Observable<Label[]> {
    const apiUrl = AppComponent.apiUrl + 'labels/labels';

    return this.http.get<Label[]>(apiUrl, {
      params: {
        loggedInUserId: userId,
        loggedInUsername: username,
        loggedInPassword: password,
        loggedInEMailAddress: eMailAddress,
        loggedInFirstName: firstName,
        loggedInLastName: lastName
      }
    }).pipe(
      map((result) => {
        this.labels=result;
        return result;
    })
    );
  }

  getLabel(labelId: number, userId: number, username: string, password: string, eMailAddress: string, firstName: string, lastName: string): Observable<Label> {
    const apiUrl = AppComponent.apiUrl + 'labels/labels/' + labelId;


    return this.http.get<Label>(apiUrl, {
      params: {
        loggedInUserId: userId,
        loggedInUsername: username,
        loggedInPassword: password,
        loggedInEMailAddress: eMailAddress,
        loggedInFirstName: firstName,
        loggedInLastName: lastName
      }
    }).pipe(
      map((result) => {
        return result;
      })
    );
  }
}
