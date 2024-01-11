import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/User";
import {catchError, map, Observable, throwError} from "rxjs";
import {AppComponent} from "../../app.component";
import {Category} from "../models/Category";
import {Label} from "../models/Label";

@Injectable({
  providedIn: 'root'
})

export class LabelService {

  constructor(private http: HttpClient) {
  }

  getLabels (username: string, password: string): Observable<Label[]> {
    const apiUrl = AppComponent.apiUrl + 'labels';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Label[]>(apiUrl, { headers });
  }

  insertLabel(username: string, password: string, label: Label): Observable<Label> {
    const apiUrl = AppComponent.apiUrl + 'labels';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post<Label>(apiUrl, label, { headers });
  }

  deleteLabel(username: string, password: string, labelId: number | undefined): Observable<number> {
    const apiUrl = AppComponent.apiUrl + `labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.delete<number>(apiUrl, { headers });
  }
}
