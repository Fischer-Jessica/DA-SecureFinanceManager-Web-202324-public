import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UserService} from "../../../logic/services/UserService";
import {Label} from "../../../logic/models/Label";
import {LabelService} from "../../../logic/services/LabelService";
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {ColourService} from "../../../logic/services/ColourService";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'logged-in-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  labelsData: { label: Label; colourHex: string }[] = [];

  constructor(private router: Router,
              private apiService: LabelService,
              private localStorageService: LocalStorageService,
              private colourService: ColourService,
              private cdr: ChangeDetectorRef,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.fetchLabels();
    }
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  private fetchLabels(): void {
    if (UserService.loggedInUser == null) {
      return;
    }
    this.apiService.getLabels(UserService.loggedInUser.username, UserService.loggedInUser.password)
      .subscribe(
        (result) => {
          for (let label of result) {
            this.colourService.getColourHex(label.labelColourId).subscribe(
              (result) => {
                this.labelsData.push({
                  label: label,
                  colourHex: result
                });
              },
              (error) => {
                console.error('Error fetching colour:', error);
                // Handle error (e.g., display an error message)
              }
            );
          }
        },
        (error) => {
          if (error.status === 404) {
            this.showAlert('You need to create a label.');
          } else if (error.status === 401) {
            this.showAlert('You are not authorized.');
          } else {
            this.showAlert('Error fetching labels.');
          }
        }
      );
  }

  deleteLabel(labelId: number | undefined) {
    if (UserService.loggedInUser == null) {
      return;
    }
    this.apiService.deleteLabel(UserService.loggedInUser.username, UserService.loggedInUser.password, labelId)
      .subscribe(
        (result) => {
          console.log('Deleted label:', result);
          this.labelsData = this.labelsData.filter((item) => item.label.labelId !== labelId);
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          console.error('Error deleting label:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  showEntries(labelId: number | undefined) {
    console.log(labelId)
    this.router.navigateByUrl(`/logged-in-homepage/labels/${labelId}/entries`);
  }
}
