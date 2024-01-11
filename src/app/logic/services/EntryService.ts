import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Subcategory} from "../models/Subcategory";
import {AppComponent} from "../../app.component";
import {Entry} from "../models/Entry";

@Injectable({
  providedIn: 'root'
})

export class EntryService {

  constructor(private http: HttpClient) {
  }

  getEntriesBySubcategoryId(username: string, password: string, subcategoryId: number | undefined): Observable<Entry[]> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry[]>(apiUrl, { headers });
  }

  getEntriesByLabelId(username: string, password: string, labelId: number | undefined): Observable<Entry[]> {
    const apiUrl = AppComponent.apiUrl + `entry-labels/labels/${labelId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry[]>(apiUrl, { headers });
  }

  insertEntry(username: string, password: string, subcategoryId: number | undefined, entry: Entry): Observable<Entry> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.post<Entry>(apiUrl, entry, { headers });
  }
}
