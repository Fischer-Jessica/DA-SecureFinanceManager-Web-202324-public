import {Component, OnInit} from '@angular/core';
import {Label} from "../../../../logic/models/Label";
import {ActivatedRoute, Router} from "@angular/router";
import {LabelService} from "../../../../logic/services/LabelService";
import {LocalStorageService} from "../../../../logic/LocalStorageService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../../logic/services/SnackBarService";

@Component({
  selector: 'app-update-label',
  templateUrl: './update-label.component.html',
  styleUrls: ['./update-label.component.css', '../../logged-in-homepage.component.css']
})

/**
 * Component for updating a label
 * @class UpdateLabelComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class UpdateLabelComponent implements OnInit {
  /**
   * The label object to store label details
   * @type {Label}
   */
  label: Label = {} as Label;

  /**
   * Constructor for UpdateLabelComponent
   * @param route The Angular ActivatedRoute service
   * @param router The Angular Router service
   * @param labelService The service for label operations
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @param localStorageService The service for managing local storage
   * @memberOf UpdateLabelComponent
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private labelService: LabelService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService,
              private localStorageService: LocalStorageService
  ) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf UpdateLabelComponent
   */
  ngOnInit(): void {
    this.fetchLabel();
  }

  /**
   * Method to fetch label data for updating
   * @memberOf UpdateLabelComponent
   */
  private fetchLabel(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
      this.router.navigateByUrl('authentication/login')
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    this.route.params.subscribe(params => {
      const labelId = +params['labelId'];

      if (isNaN(labelId)) {
        this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
        this.router.navigate([`/logged-in-homepage/categories`]);
      }

      this.labelService.getLabel(
        loggedInUser.username,
        loggedInUser.password,
        labelId
      ).subscribe(
        result => this.label = result,
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.update-label.alert_label_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.labels.update-label.console_error_fetching_label'), error);
          }
        }
      );
    });
  }

  /**
   * Method to handle form submission for updating label
   * @param formData The form data submitted
   * @memberOf UpdateLabelComponent
   */
  onSubmit(formData: any): void {
    if (this.label.labelName === '' || this.label.labelColourId === 0) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.create-label.alert_create_label_missing_fields'));
      return;
    }

    if (!formData.valid) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_invalid_formData'));
      return;
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
      this.router.navigateByUrl('authentication/login')
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    if (this.label.labelId != null) {
      this.labelService.updateLabel(
        loggedInUser.username,
        loggedInUser.password,
        this.label.labelId,
        this.label
      ).subscribe(
        result => {
          this.router.navigate(['logged-in-homepage/labels']);
        },
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.update-label.alert_label_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.labels.update-label.console_error_fetching_label'), error);
          }
        }
      );
    }
  }

  /**
   * Callback function invoked when a colour is selected
   * @param colourId The ID of the selected colour
   * @memberOf UpdateLabelComponent
   */
  onColourSelected(colourId: number): void {
    this.label.labelColourId = colourId;
  }
}
