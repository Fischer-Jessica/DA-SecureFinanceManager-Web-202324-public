import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/User";
import {catchError, map, Observable, throwError} from "rxjs";
import {AppComponent} from "../../app.component";
import {Category} from "../models/Category";
import {Subcategory} from "../models/Subcategory";

@Injectable({
  providedIn: 'root'
})

export class SubcategoryService {

  constructor(private http: HttpClient) {
  }

  getSubcategories(username: string, password: string, categoryId: number): Observable<Subcategory[]> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Subcategory[]>(apiUrl, { headers });
  }

  insertSubcategory(username: string, password: string, categoryId: number, subcategory: Subcategory): Observable<Subcategory> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.post<Subcategory>(apiUrl, subcategory, { headers });
  }
}
