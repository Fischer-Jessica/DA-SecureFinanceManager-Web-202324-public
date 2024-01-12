import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ColourService} from "../../../logic/services/ColourService";
import {Colour} from "../../../logic/models/Colour";

@Component({
  selector: 'app-colour-picker',
  templateUrl: './colour-picker.component.html',
  styleUrls: ['./colour-picker.component.css']
})
export class ColourPickerComponent implements OnInit {
  colourDatas: { colour: Colour; colourName: string }[] = [];
  selectedColourId: number = 0;

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
          this.colourDatas = []; // Clear existing data
          for (let colour of result) {
            this.colourService.getColourName(colour.colourId).subscribe(
              (result) => {
                this.colourDatas.push({
                  colour: colour,
                  colourName: result,
                });
              },
              (error) => {
                console.error('Error fetching colour-name:', error);
                // Handle error (e.g., display an error message)
              }
            );
          }
        },
        (error) => {
          console.error('Error fetching colours:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  onColourSelected(): void {
    console.log('selectedColourId:', this.selectedColourId);
    this.colourSelected.emit(this.selectedColourId);
  }
}
