import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Label} from "../../../logic/models/Label";
import {LabelService} from "../../../logic/services/LabelService";
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {ColourService} from "../../../logic/services/ColourService";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

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
              private snackBar: MatSnackBar,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      this.fetchLabels(loggedInUser.username, loggedInUser.password);
    }
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  private fetchLabels(username: string, password: string): void {
    this.apiService.getLabels(username, password)
      .subscribe(
        (result) => {
          this.labelsData = []; // Clear existing data
          for (let label of result) {
            this.colourService.getColourHex(label.labelColourId).subscribe(
              (colourResult) => {
                this.labelsData.push({
                  label: label,
                  colourHex: colourResult
                });
                // Sort labelsData after each new entry
                this.labelsData.sort((a, b) => {
                  if (a.label.labelId !== undefined && b.label.labelId !== undefined) {
                    return a.label.labelId - b.label.labelId;
                  }
                  return 0;
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
            this.showAlert(this.translate.instant('logged-in-homepage.labels.alert_create_label_first'));
          } else if (error.status === 401) {
            this.showAlert(this.translate.instant('authorisation.alert_user_not_logged_in'));
          } else {
            this.showAlert(this.translate.instant('logged-in-homepage.labels.error_fetching_labels'));
          }
        }
      );
  }

  deleteLabel(labelId: number | undefined) {
    const confirmDelete = confirm(this.translate.instant('logged-in-homepage.labels.confirm_delete_label'));
    if (!confirmDelete) {
      return; // Wenn der Benutzer die Aktion nicht bestätigt, breche den Löschvorgang ab
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      return;
    }
    const loggedInUser = JSON.parse(storedUser);
    this.apiService.deleteLabel(loggedInUser.username, loggedInUser.password, labelId)
      .subscribe(
        (result) => {
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
    this.router.navigateByUrl(`/logged-in-homepage/labels/${labelId}/entries`);
  }
}
