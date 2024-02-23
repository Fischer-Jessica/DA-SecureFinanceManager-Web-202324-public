import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppComponent} from "../../app.component";
import {Subcategory} from "../models/Subcategory";

@Injectable({
  providedIn: 'root'
})

/**
 * Service to interact with subcategory-related API endpoints.
 * @class SubcategoryService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class SubcategoryService {

  /**
   * Creates an instance of SubcategoryService.
   * @param {HttpClient} http - The HttpClient instance used for HTTP requests.
   * @memberof SubcategoryService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retrieves all subcategories of a category from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category.
   * @returns {Observable<Subcategory[]>} An observable of subcategory array.
   */
  getSubcategories(username: string, password: string, categoryId: number): Observable<Subcategory[]> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Subcategory[]>(apiUrl, {headers});
  }

  /**
   * Retrieves a specific subcategory from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @returns {Observable<Subcategory>} An observable of subcategory.
   */
  getSubcategory(username: string, password: string, categoryId: number, subcategoryId: number): Observable<Subcategory> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories/${subcategoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Subcategory>(apiUrl, {headers});
  }

  /**
   * Inserts a new subcategory into the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category.
   * @param {Subcategory} subcategory - The subcategory object to insert.
   * @returns {Observable<Subcategory>} An observable of subcategory.
   */
  insertSubcategory(username: string, password: string, categoryId: number, subcategory: Subcategory): Observable<Subcategory> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post<Subcategory>(apiUrl, subcategory, {headers});
  }

  /**
   * Updates an existing subcategory on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {Subcategory} subcategory - The updated subcategory object.
   * @returns {Observable<Subcategory>} An observable of subcategory.
   */
  updateSubcategory(username: string, password: string, subcategory: Subcategory): Observable<Subcategory> {
    const apiUrl = AppComponent.apiUrl + `categories/${subcategory.subcategoryCategoryId}/subcategories/${subcategory.subcategoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch<Subcategory>(apiUrl, subcategory, {headers});
  }

  /**
   * Deletes a subcategory from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number | undefined} categoryId - The unique identifier of the category.
   * @param {number | undefined} subcategoryId - The unique identifier of the subcategory.
   * @returns {Observable<number>} An observable of number.
   */
  deleteSubcategory(username: string, password: string, categoryId: number | undefined, subcategoryId: number | undefined): Observable<number> {
    const apiUrl = AppComponent.apiUrl + `categories/${categoryId}/subcategories/` + subcategoryId;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.delete<number>(apiUrl, {headers});
  }
}
