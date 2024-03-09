import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entry} from "../models/Entry";
import {CONFIG} from "../../app.config";

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
   * Retrieves entries of a specific subcategory from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @returns {Observable<Entry[]>} An observable of entry array.
   */
  getEntries(username: string, password: string, subcategoryId: number): Observable<Entry[]> {
    const getEntriesUrl = CONFIG.apiURL + `categories/subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry[]>(getEntriesUrl, {headers});
  }

  /**
   * Retrieves a specific entry by the entryId and its subcategoryId from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @param {number} entryId - The unique identifier of the entry.
   * @returns {Observable<Entry>} An observable of entry.
   */
  getEntry(username: string, password: string, subcategoryId: number, entryId: number): Observable<Entry> {
    const getEntryUrl = CONFIG.apiURL + `categories/subcategories/${subcategoryId}/entries/${entryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry>(getEntryUrl, {headers});
  }

  /**
   * Inserts a new entry into a subcategory on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @param {Entry} newEntry - The entry object to insert.
   * @returns {Observable<Entry>} An observable of entry.
   */
  insertEntry(username: string, password: string, subcategoryId: number, newEntry: Entry): Observable<Entry> {
    const insertEntryUrl = CONFIG.apiURL + `categories/subcategories/${subcategoryId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post<Entry>(insertEntryUrl, newEntry, {headers});
  }

  /**
   * Updates an existing entry of a subcategory on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @param {Entry} updatedEntry - The updated entry object.
   * @returns {Observable<Entry>} An observable of entry.
   */
  updateEntry(username: string, password: string, subcategoryId: number, updatedEntry: Entry): Observable<Entry> {
    const updateEntryId = CONFIG.apiURL + `categories/subcategories/${subcategoryId}/entries/${updatedEntry.entryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch<Entry>(updateEntryId, updatedEntry, {headers});
  }

  /**
   * Deletes an entry of a subcategory from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} subcategoryId - The unique identifier of the subcategory.
   * @param {number} entryId - The unique identifier of the entry.
   * @returns {Observable<number>} An observable of number.
   */
  deleteEntry(username: string, password: string, subcategoryId: number, entryId: number): Observable<number> {
    const deleteEntryUrl = CONFIG.apiURL + `categories/subcategories/${subcategoryId}/entries/${entryId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.delete<number>(deleteEntryUrl, {headers});
  }
}
