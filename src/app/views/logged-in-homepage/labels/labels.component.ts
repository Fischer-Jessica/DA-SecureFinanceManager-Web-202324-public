import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Label} from "../../../logic/models/Label";
import {LabelService} from "../../../logic/services/LabelService";
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {ColourService} from "../../../logic/services/ColourService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../logic/services/SnackBarService";

@Component({
  selector: 'logged-in-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css', '../logged-in-homepage.component.css']
})

/**
 * Component for managing labels
 * @class LabelsComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class LabelsComponent implements OnInit {
  /**
   * Array to store label data along with their corresponding colours
   * @type {{ label: Label; colourHex: string }[]}
   */
  labelsData: { label: Label; colourHex: string }[] = [];

  /**
   * Constructor for LabelsComponent
   * @param router The Angular Router service
   * @param labelService The service for label operations
   * @param colourService The service for managing colours
   * @param localStorageService The service for managing local storage
   * @param snackBarService The service for displaying snack bar messages
   * @param translateService The service for translation
   * @param cdr The Angular ChangeDetectorRef service
   * @memberOf LabelsComponent
   */
  constructor(private router: Router,
              private labelService: LabelService,
              private colourService: ColourService,
              private localStorageService: LocalStorageService,
              private snackBarService: SnackBarService,
              private translateService: TranslateService,
              private cdr: ChangeDetectorRef) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf LabelsComponent
   */
  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
      this.router.navigateByUrl('/authentication/login');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);
    this.fetchLabels(loggedInUser.username, loggedInUser.password);
  }

  /**
   * Method to delete a label
   * @param labelId The ID of the label to delete
   * @memberOf LabelsComponent
   */
  deleteLabel(labelId: number | undefined) {
    const confirmDelete = confirm(this.translateService.instant('logged-in-homepage.labels.confirm_delete_label'));
    if (!confirmDelete) {
      return;
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
      this.router.navigateByUrl('/authentication/login');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);
    this.labelService.deleteLabel(loggedInUser.username, loggedInUser.password, labelId)
      .subscribe(
        (result) => {
          this.labelsData = this.labelsData.filter((item) => item.label.labelId !== labelId);
          this.cdr.detectChanges();
        },
        (error) => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.alert_parameter_invalid'));
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.alert_label_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.labels.console_error_deleting_label'), error);
          }
        }
      );
  }

  /**
   * Method to fetch labels data
   * @memberOf LabelsComponent
   */
  private fetchLabels(username: string, password: string): void {
    this.labelService.getLabels(username, password)
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
                this.labelsData.sort((a, b) => {
                  if (a.label.labelId !== undefined && b.label.labelId !== undefined) {
                    return b.label.labelId - a.label.labelId;
                  }
                  return 0;
                });
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
        },
        (error) => {
          if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.alert_create_label_first'));
          } else if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.labels.console_error_fetching_labels'), error);
          }
        }
      );
  }

  /**
   * Method to navigate to the entries associated with a label
   * @param labelId The ID of the label
   * @memberOf LabelsComponent
   */
  showEntries(labelId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/labels/${labelId}/entries`);
  }
}
