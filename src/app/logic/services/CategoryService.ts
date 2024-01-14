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

  getCategory(username: string, password: string, categoryId: number): Observable<Category> {
    const apiUrl = AppComponent.apiUrl + 'categories/' + categoryId;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Category>(apiUrl, { headers });
  }

  insertCategory(username: string, password: string, category: Category): Observable<Category> {
    const apiUrl = AppComponent.apiUrl + 'categories';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.post<Category>(apiUrl, category, { headers });
  }

  updateCategory(username: string, password: string, categoryId: number, updatedCategory: Category): Observable<any> {
    const url = AppComponent.apiUrl + `categories/${categoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch(url, updatedCategory, { headers });
  }

  deleteCategory(username: string, password: string, categoryId: number | undefined): Observable<number> {
    const apiUrl = AppComponent.apiUrl + 'categories/' + categoryId;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.delete<number>(apiUrl, { headers });
  }
}
