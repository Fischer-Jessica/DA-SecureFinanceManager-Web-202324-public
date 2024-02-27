import {Component} from '@angular/core';
import {Label} from '../../../../logic/models/Label';
import {LabelService} from '../../../../logic/services/LabelService';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../../logic/LocalStorageService';
import {SnackBarService} from "../../../../logic/services/SnackBarService";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-create-new-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.css', '../../logged-in-homepage.component.css', '../../../../app.component.css']
})
/**
 * Component for creating a new label
 * @class CreateLabelComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class CreateLabelComponent {
  /**
   * The label object to store label details
   * @type {Label}
   */
  label: Label = {
    labelName: '',
    labelColourId: 0,
  };

  /**
   * Constructor for CreateLabelComponent
   * @param router The Angular router service
   * @param labelService The service for label operations
   * @param localStorageService The service for managing local storage
   * @param translationService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @memberOf CreateLabelComponent
   */
  constructor(private router: Router,
              private labelService: LabelService,
              private localStorageService: LocalStorageService,
              private translationService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Callback function invoked when a colour is selected
   * @param colourId The ID of the selected colour
   * @memberOf CreateLabelComponent
   */
  onColourSelected(colourId: number): void {
    this.label.labelColourId = colourId;
  }

  /**
   * Method to handle form submission
   * @param formData The form data submitted
   * @memberOf CreateLabelComponent
   */
  onSubmit(formData: Label) {
    formData.labelColourId = this.label.labelColourId;
    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (formData.labelName === '' || formData.labelColourId === 0) {
      this.snackBarService.showAlert(this.translationService.instant('logged-in-homepage.labels.create-label.alert_create_label_missing_fields'));
      return;
    }

    if (!storedUser) {
      this.snackBarService.showAlert(this.translationService.instant('authentication.alert_user_not_logged_in'));
      this.router.navigateByUrl('/authentication/login');
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    this.labelService.insertLabel(loggedInUser.username, loggedInUser.password, formData)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/logged-in-homepage/labels');
        },
        error: (err) => {
          if (err.status === 401) {
            this.snackBarService.showAlert(this.translationService.instant('authentication.alert_user_not_logged_in'));
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else if (err.status === 400) {
            this.snackBarService.showAlert(this.translationService.instant('logged-in-homepage.labels.create-label.alert_create_label_missing_fields'));
          } else {
            this.snackBarService.showAlert(this.translationService.instant('alert_error'));
            console.error(this.translationService.instant('logged-in-homepage.label.create-label.console_error_creating_label'), err);
          }
        }
      });
  }
}
