import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Label} from "../models/Label";
import {CONFIG} from "../../app.config";

@Injectable({
  providedIn: 'root'
})

/**
 * Service to interact with label-related API endpoints.
 * @class LabelService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class LabelService {

  /**
   * Creates an instance of LabelService.
   * @param {HttpClient} http - The HttpClient instance used for HTTP requests.
   * @memberof LabelService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retrieves all labels from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Observable<Label[]>} An observable of label array.
   */
  getLabels(username: string, password: string): Observable<Label[]> {
    const apiUrl = CONFIG.apiURL + 'labels';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Label[]>(apiUrl, {headers});
  }

  /**
   * Retrieves a specific label from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} labelId - The unique identifier of the label.
   * @returns {Observable<Label>} An observable of label.
   */
  getLabel(username: string, password: string, labelId: number): Observable<Label> {
    const apiUrl = CONFIG.apiURL + `labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Label>(apiUrl, {headers});
  }

  /**
   * Inserts a new label into the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {Label} label - The label object to insert.
   * @returns {Observable<Label>} An observable of label.
   */
  insertLabel(username: string, password: string, label: Label): Observable<Label> {
    const apiUrl = CONFIG.apiURL + 'labels';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post<Label>(apiUrl, label, {headers});
  }

  /**
   * Updates an existing label on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} labelId - The unique identifier of the label.
   * @param {Label} label - The updated label object.
   * @returns {Observable<Label>} An observable of label.
   */
  updateLabel(username: string, password: string, labelId: number, label: Label): Observable<Label> {
    const apiUrl = CONFIG.apiURL + `labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch<Label>(apiUrl, label, {headers});
  }

  /**
   * Deletes a label from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number | undefined} labelId - The unique identifier of the label.
   * @returns {Observable<number>} An observable of number.
   */
  deleteLabel(username: string, password: string, labelId: number | undefined): Observable<number> {
    const apiUrl = CONFIG.apiURL + `labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.delete<number>(apiUrl, {headers});
  }
}
