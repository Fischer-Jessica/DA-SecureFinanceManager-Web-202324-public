import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Colour} from "../models/Colour";
import {AppComponent} from "../../app.component";

@Injectable({
  providedIn: 'root'
})

export class ColourService {
  colours: Colour[] | null = null;

  constructor(private http: HttpClient) {
  }

  getColours(): Observable<Colour[]> {
    const apiUrl = AppComponent.apiUrl + 'colours';

    return this.http.get<Colour[]>(apiUrl, {}).pipe(
      map((result) => {
        this.colours = result;
        return result;
      })
    );
  }

  getColour(colourId: number): Observable<Colour> {
    const apiUrl: string = AppComponent.apiUrl + 'colours/' + colourId;

    return this.http.get<Colour>(apiUrl, {}).pipe(
      map((result) => {
        return result;
      })
    );
  }
}
