import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Subcategory} from "../models/Subcategory";
import {CONFIG} from "../../app.config";

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
    const getSubcategoriesUrl = CONFIG.apiURL + `categories/${categoryId}/subcategories`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Subcategory[]>(getSubcategoriesUrl, {headers});
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
    const getSubcategoryUrl = CONFIG.apiURL + `categories/${categoryId}/subcategories/${subcategoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Subcategory>(getSubcategoryUrl, {headers});
  }

  /**
   * Retrieves the sum of a specific subcategory within a category from the backend.
   * @param {number} categoryId - The unique identifier of the category.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Observable<number>} An observable of subcategory sum.
   */
  getSubcategorySum(categoryId: number, subcategoryId: number, username: string, password: string): Observable<number> {
    const getSubcategorySum = CONFIG.apiURL + `categories/${categoryId}/subcategories/${subcategoryId}/sum`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<number>(getSubcategorySum, {headers});
  }

  /**
   * Inserts a new subcategory into the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category.
   * @param {Subcategory} newSubcategory - The subcategory object to insert.
   * @returns {Observable<Subcategory>} An observable of subcategory.
   */
  insertSubcategory(username: string, password: string, categoryId: number, newSubcategory: Subcategory): Observable<Subcategory> {
    const insertSubcategoryUrl = CONFIG.apiURL + `categories/${categoryId}/subcategories`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post<Subcategory>(insertSubcategoryUrl, newSubcategory, {headers});
  }

  /**
   * Updates an existing subcategory on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {Subcategory} updatedSubcategory - The updated subcategory object.
   * @returns {Observable<Subcategory>} An observable of subcategory.
   */
  updateSubcategory(username: string, password: string, updatedSubcategory: Subcategory): Observable<Subcategory> {
    const updateSubcategoryUrl = CONFIG.apiURL + `categories/${updatedSubcategory.subcategoryCategoryId}/subcategories/${updatedSubcategory.subcategoryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch<Subcategory>(updateSubcategoryUrl, updatedSubcategory, {headers});
  }

  /**
   * Deletes a subcategory from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} categoryId - The unique identifier of the category.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @returns {Observable<number>} An observable of number.
   */
  deleteSubcategory(username: string, password: string, categoryId: number, subcategoryId: number): Observable<number> {
    const deleteSubcategoryUrl = CONFIG.apiURL + `categories/${categoryId}/subcategories/` + subcategoryId;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });
    return this.http.delete<number>(deleteSubcategoryUrl, {headers});
  }
}
