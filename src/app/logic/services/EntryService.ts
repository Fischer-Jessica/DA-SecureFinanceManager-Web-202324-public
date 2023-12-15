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

  getEntries(username: string, password: string, subcategoryId: number | undefined): Observable<Entry[]> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry[]>(apiUrl, { headers });
  }

  insertSubcategory(username: string, password: string, subcategoryId: number, entry: Entry): Observable<Entry> {
    const apiUrl = AppComponent.apiUrl + `subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.post<Entry>(apiUrl, entry, { headers });
  }
}
