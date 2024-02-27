import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../models/Category";
import {CONFIG} from "../../app.config";

@Injectable({
  providedIn: 'root'
})

/**
 * Service to interact with category-related API endpoints.
 * @class CategoryService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class CategoryService {
  /**
   * Creates an instance of CategoryService.
   * @param {HttpClient} http - The HttpClient instance used for HTTP requests.
   * @memberof CategoryService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retrieves all categories from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Observable<Category[]>} An observable of category array.
   */
  getCategories(username: string, password: string): Observable<Category[]> {
    const apiUrl = CONFIG.apiURL + 'categories';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Category[]>(apiUrl, {headers});
  }

  /**
   * Retrieves a specific category from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category.
   * @returns {Observable<Category>} An observable of category.
   */
  getCategory(username: string, password: string, categoryId: number): Observable<Category> {
    const apiUrl = CONFIG.apiURL + 'categories/' + categoryId;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Category>(apiUrl, {headers});
  }

  /**
   * Inserts a new category into the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {Category} category - The category object to insert.
   * @returns {Observable<Category>} An observable of category.
   */
  insertCategory(username: string, password: string, category: Category): Observable<Category> {
    const apiUrl = CONFIG.apiURL + 'categories';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.post<Category>(apiUrl, category, {headers});
  }

  /**
   * Updates an existing category on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category to update.
   * @param {Category} updatedCategory - The updated category object.
   * @returns {Observable<any>} An observable of any.
   */
  updateCategory(username: string, password: string, categoryId: number, updatedCategory: Category): Observable<any> {
    const url = CONFIG.apiURL + `categories/${categoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch(url, updatedCategory, {headers});
  }

  /**
   * Deletes a category from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category to delete.
   * @returns {Observable<number>} An observable of number.
   */
  deleteCategory(username: string, password: string, categoryId: number | undefined): Observable<number> {
    const apiUrl = CONFIG.apiURL + 'categories/' + categoryId;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.delete<number>(apiUrl, {headers});
  }
}
