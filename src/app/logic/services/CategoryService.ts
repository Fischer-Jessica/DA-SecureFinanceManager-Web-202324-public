import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/User";
import {catchError, map, Observable, throwError} from "rxjs";
import {AppComponent} from "../../app.component";
import {Category} from "../models/Category";

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  constructor(private http: HttpClient) {
  }

  getCategories(username: string, password: string): Observable<Category[]> {
    const apiUrl = AppComponent.apiUrl + 'categories';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Category[]>(apiUrl, { headers });
  }

  insertCategory(username: string, password: string, category: Category): Observable<Category> {
    const apiUrl = AppComponent.apiUrl + 'categories';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.post<Category>(apiUrl, category, { headers });
  }
}
