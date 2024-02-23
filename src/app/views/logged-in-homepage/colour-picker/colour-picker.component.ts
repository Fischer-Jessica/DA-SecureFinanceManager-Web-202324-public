import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColourService} from "../../../logic/services/ColourService";
import {Colour} from "../../../logic/models/Colour";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../logic/services/SnackBarService";

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.css']
})

/**
 * A component representing a colour picker.
 * Allows users to select a colour from a list of available colours.
 * Emits the selected colour ID through the `colourSelected` event.
 * @class ColourPickerComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class ColourPickerComponent implements OnInit {
  /**
   * The list of available colours.
   */
  colours: Colour[] = [];

  /**
   * The ID of the currently selected colour.
   */
  @Input() selectedColourId: number = 0;

  /**
   * Event emitter for the selected colour ID.
   * Emits the selected colour ID when a colour is chosen.
   */
  @Output() colourSelected = new EventEmitter<number>();

  /**
   * Constructs the ColourPickerComponent.
   *
   * @param colourService The service for fetching colours.
   * @param translateService The service for translation.
   * @param snackBarService The service for displaying snack bar messages.
   */
  constructor(private colourService: ColourService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * It is used to retrieve the list of available colours when the component is initialized.
   */
  ngOnInit(): void {
    this.getColours();
  }

  /**
   * Fetches the list of available colours from the colour service.
   * If successful, updates the `colours` property with the retrieved data.
   * If an error occurs, logs the error to the console.
   */
  getColours(): void {
    this.colourService
      .getColours()
      .subscribe(
        (result) => {
          this.colours = [];
          for (let colour of result) {
            this.colours.push(colour);
          }
        },
        (error) => {
          if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.colours.alert_colours_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.colours.console_error_fetching_colours'), error);
          }
        }
      );
  }

  /**
   * Event handler for when a colour is selected.
   * Emits the selected colour ID through the `colourSelected` event.
   *
   * @param selectedColourId The ID of the selected colour.
   */
  onColourSelected(selectedColourId: number): void {
    this.colourSelected.emit(selectedColourId);
    this.selectedColourId = selectedColourId;
  }
}
