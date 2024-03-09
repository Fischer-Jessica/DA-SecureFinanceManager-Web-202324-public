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
    const getLabelsUrl = CONFIG.apiURL + 'labels';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Label[]>(getLabelsUrl, {headers});
  }

  /**
   * Retrieves a specific label from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} labelId - The unique identifier of the label.
   * @returns {Observable<Label>} An observable of label.
   */
  getLabel(username: string, password: string, labelId: number): Observable<Label> {
    const getLabelUrl = CONFIG.apiURL + `labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.get<Label>(getLabelUrl, {headers});
  }

  /**
   * Inserts a new label into the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {Label} newLabel - The label object to insert.
   * @returns {Observable<Label>} An observable of label.
   */
  insertLabel(username: string, password: string, newLabel: Label): Observable<Label> {
    const insertLabelUrl = CONFIG.apiURL + 'labels';

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.post<Label>(insertLabelUrl, newLabel, {headers});
  }

  /**
   * Updates an existing label on the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} labelId - The unique identifier of the label.
   * @param {Label} updatedLabel - The updated label object.
   * @returns {Observable<Label>} An observable of label.
   */
  updateLabel(username: string, password: string, labelId: number, updatedLabel: Label): Observable<Label> {
    const updateLabelUrl = CONFIG.apiURL + `labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.patch<Label>(updateLabelUrl, updatedLabel, {headers});
  }

  /**
   * Deletes a label from the backend.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @param {number} labelId - The unique identifier of the label.
   * @returns {Observable<number>} An observable of number.
   */
  deleteLabel(username: string, password: string, labelId: number): Observable<number> {
    const deleteLabelUrl = CONFIG.apiURL + `labels/${labelId}`;

    const headers = new HttpHeaders({
      'API-Version': '1',
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`
    });

    return this.http.delete<number>(deleteLabelUrl, {headers});
  }
}
