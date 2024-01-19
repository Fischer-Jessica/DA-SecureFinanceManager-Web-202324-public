import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColourService} from "../../../logic/services/ColourService";
import {Colour} from "../../../logic/models/Colour";

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.css']
})
export class ColourPickerComponent implements OnInit {
  colours: Colour[] = [];

  @Input() selectedColourId: number = 0;
  @Output() colourSelected = new EventEmitter<number>();

  constructor(private colourService: ColourService) { }

  ngOnInit(): void {
    this.getColours();
  }

  getColours(): void {
    this.colourService
      .getColours()
      .subscribe(
        (result) => {
          this.colours = []; // Clear existing data
          for (let colour of result) {
            this.colours.push(colour);
          }
        },
        (error) => {
          console.error('Error fetching colours:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  onColourSelected(selectedColourId: number): void {
    this.colourSelected.emit(selectedColourId);
    this.selectedColourId = selectedColourId;
  }
}
