import {Observable} from "rxjs";
import {Entry} from "../models/Entry";
import {AppComponent} from "../../app.component";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class EntryLabelService {

  constructor(private http: HttpClient) {
  }

  getEntriesByLabelId(username: string, password: string, labelId: number | undefined): Observable<Entry[]> {
    const apiUrl = AppComponent.apiUrl + `entry-labels/labels/${labelId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry[]>(apiUrl, {headers});
  }

  removeLabelFromEntry(username: string, password: string, labelId: number | undefined, entryId: number | undefined): Observable<number> {
    const apiUrl = AppComponent.apiUrl + `entry-labels/entries/${entryId}/labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.delete<number>(apiUrl, {headers});
  }
}
