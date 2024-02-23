import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AppComponent} from "../../app.component";
import {Entry} from "../models/Entry";

@Injectable({
  providedIn: 'root'
})

/**
 * Service to interact with entry-related API endpoints.
 * @class EntryService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class EntryService {

  /**
   * Creates an instance of EntryService.
   * @param {HttpClient} http - The HttpClient instance used for HTTP requests.
   * @memberof EntryService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retrieves entries by subcategory ID from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number | undefined} subcategoryId - The unique identifier of the subcategory.
   * @returns {Observable<Entry[]>} An observable of entry array.
   */
  getEntries(username: string, password: string, subcategoryId: number | undefined): Observable<Entry[]> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry[]>(apiUrl, {headers});
  }

  /**
   * Retrieves a specific entry by ID and subcategory ID from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number | undefined} subcategoryId - The unique identifier of the subcategory.
   * @param {number | undefined} entryId - The unique identifier of the entry.
   * @returns {Observable<Entry>} An observable of entry.
   */
  getEntry(username: string, password: string, subcategoryId: number | undefined, entryId: number | undefined): Observable<Entry> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries/${entryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry>(apiUrl, {headers});
  }

  /**
   * Inserts a new entry into the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number | undefined} subcategoryId - The unique identifier of the subcategory.
   * @param {Entry} entry - The entry object to insert.
   * @returns {Observable<Entry>} An observable of entry.
   */
  insertEntry(username: string, password: string, subcategoryId: number | undefined, entry: Entry): Observable<Entry> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post<Entry>(apiUrl, entry, {headers});
  }

  /**
   * Updates an existing entry on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number | undefined} subcategoryId - The unique identifier of the subcategory.
   * @param {Entry} entry - The updated entry object.
   * @returns {Observable<Entry>} An observable of entry.
   */
  updateEntry(username: string, password: string, subcategoryId: number | undefined, entry: Entry): Observable<Entry> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries/${entry.entryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch<Entry>(apiUrl, entry, {headers});
  }

  /**
   * Deletes an entry from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number | undefined} subcategoryId - The unique identifier of the subcategory.
   * @param {number | undefined} entryId - The unique identifier of the entry.
   * @returns {Observable<number>} An observable of number.
   */
  deleteEntry(username: string, password: string, subcategoryId: number | undefined, entryId: number | undefined): Observable<number> {
    const apiUrl = AppComponent.apiUrl + `categories/subcategories/${subcategoryId}/entries/${entryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.delete<number>(apiUrl, {headers});
  }
}
