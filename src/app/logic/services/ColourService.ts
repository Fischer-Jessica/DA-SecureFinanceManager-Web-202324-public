import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Colour} from "../models/Colour";
import {CONFIG} from "../../app.config";

@Injectable({
  providedIn: 'root'
})

/**
 * Service to interact with colour-related API endpoints.
 * @class ColourService
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class ColourService {
  /**
   * Creates an instance of ColourService.
   * @param {HttpClient} http - The HttpClient instance used for HTTP requests.
   * @memberof ColourService
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Retrieves all colours from the backend.
   * @returns {Observable<Colour[]>} An observable of colour array.
   */
  getColours(): Observable<Colour[]> {
    const getColoursUrl = CONFIG.apiURL + 'colours';

    const headers = new HttpHeaders({
      'API-Version': '1'
    });

    return this.http.get<Colour[]>(getColoursUrl, {headers}).pipe(
      map((result) => {
        return result;
      })
    );
  }

  /**
   * Retrieves a specific colour from the backend.
   * @param {number} colourId - The unique identifier of the colour.
   * @returns {Observable<Colour>} An observable of colour.
   */
  getColour(colourId: number): Observable<Colour> {
    const getColourUrl: string = CONFIG.apiURL + 'colours/' + colourId;

    const headers = new HttpHeaders({
      'API-Version': '1'
    });

    return this.http.get<Colour>(getColourUrl, {headers}).pipe(
      map((result) => {
        return result;
      })
    );
  }

  /**
   * Retrieves the hexadecimal code of a specific colour from the backend.
   * @param {number} colourId - The unique identifier of the colour.
   * @returns {Observable<string>} An observable of hexadecimal colour code.
   */
  getColourHex(colourId: number): Observable<string> {
    const getColourHexUrl: string = CONFIG.apiURL + 'colours/' + colourId;

    const headers = new HttpHeaders({
      'API-Version': '1'
    });

    return this.http.get<Colour>(getColourHexUrl, {headers}).pipe(
      map((result) => {
        return result.colourCode;
      })
    );
  }
}
