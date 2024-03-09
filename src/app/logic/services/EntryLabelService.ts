import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Entry} from "../models/Entry";
import {Label} from "../models/Label";
import {CONFIG} from "../../app.config";

@Injectable({
  providedIn: 'root'
})

/**
 * Service to manage associations between entries and labels.
 * @class EntryLabelService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class EntryLabelService {
  /**
   * Creates an instance of EntryLabelService.
   * @param {HttpClient} http - The HttpClient instance used for HTTP requests.
   * @memberof EntryLabelService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retrieves entries associated with a specific label from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} labelId - The unique identifier of the label.
   * @returns {Observable<Entry[]>} An observable of entry array.
   */
  getEntriesByLabelId(username: string, password: string, labelId: number): Observable<Entry[]> {
    const getEntriesByLabelIdUrl = CONFIG.apiURL + `entry-labels/labels/${labelId}/entries`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Entry[]>(getEntriesByLabelIdUrl, {headers});
  }

  /**
   * Retrieves labels associated with a specific entry from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} entryId - The unique identifier of the entry.
   * @returns {Observable<Label[]>} An observable of label array.
   */
  getLabelsByEntryId(username: string, password: string, entryId: number): Observable<Label[]> {
    const getLabelsByEntryIdUrl = CONFIG.apiURL + `entry-labels/entries/${entryId}/labels`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Label[]>(getLabelsByEntryIdUrl, {headers});
  }

  /**
   * Associates a label with a specific entry on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} entryId - The unique identifier of the entry.
   * @param {number} labelId - The unique identifier of the label.
   * @returns {Observable<any>} An observable of any.
   */
  addLabelToEntry(username: string, password: string, entryId: number, labelId: number): Observable<any> {
    const addLabelToEntryUrl: string = CONFIG.apiURL + `entry-labels/entries/${entryId}/labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post(addLabelToEntryUrl, null, {headers});
  }

  /**
   * Removes a label from a specific entry on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} labelId - The unique identifier of the label.
   * @param {number} entryId - The unique identifier of the entry.
   * @returns {Observable<number>} An observable of number.
   */
  removeLabelFromEntry(username: string, password: string, labelId: number, entryId: number): Observable<number> {
    const removeLabelFromEntryUrl = CONFIG.apiURL + `entry-labels/entries/${entryId}/labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.delete<number>(removeLabelFromEntryUrl, {headers});
  }
}
