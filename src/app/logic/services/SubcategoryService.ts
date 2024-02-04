import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppComponent} from "../../app.component";
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

    return this.http.get<Subcategory[]>(apiUrl, {headers});
  }

  getSubcategory(username: string, password: string, categoryId: number, subcategoryId: number): Observable<Subcategory> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories/${subcategoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Subcategory>(apiUrl, {headers});
  }

  insertSubcategory(username: string, password: string, categoryId: number, subcategory: Subcategory): Observable<Subcategory> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.post<Subcategory>(apiUrl, subcategory, {headers});
  }

  updateSubcategory(username: string, password: string, subcategory: Subcategory): Observable<Subcategory> {
    const apiUrl = AppComponent.apiUrl + `categories/${subcategory.subcategoryCategoryId}/subcategories/${subcategory.subcategoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.patch<Subcategory>(apiUrl, subcategory, {headers});
  }

  deleteSubcategory(username: string, password: string, categoryId: number | undefined, subcategoryId: number | undefined) {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories/` + subcategoryId;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.delete<number>(apiUrl, {headers});
  }
}
