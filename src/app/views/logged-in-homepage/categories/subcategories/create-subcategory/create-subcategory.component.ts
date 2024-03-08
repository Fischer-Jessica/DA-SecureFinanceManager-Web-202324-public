import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SubcategoryService} from "../../../../../logic/services/SubcategoryService";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {Subcategory} from "../../../../../logic/models/Subcategory";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../../../logic/services/SnackBarService";

@Component({
  selector: 'app-create-new-subcategory',
  templateUrl: './create-subcategory.component.html',
  styleUrls: ['./create-subcategory.component.css', '../../../logged-in-homepage.component.css', '../../../../../app.component.css']
})
/**
 * Component for creating a new subcategory
 * @class CreateSubcategoryComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class CreateSubcategoryComponent {
  /**
   * The subcategory object to store subcategory details
   * @type {Subcategory}
   */
  subcategory: Subcategory = {
    subcategoryName: '',
    subcategoryColourId: 0,
    subcategoryCategoryId: 0,
  };

  /**
   * Constructor for CreateSubcategoryComponent
   * @param router The Angular Router service
   * @param route The Angular ActivatedRoute service
   * @param subcategoryService The service for subcategory operations
   * @param localStorageService The service for managing local storage
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @memberOf CreateSubcategoryComponent
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private subcategoryService: SubcategoryService,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Callback function invoked when a colour is selected
   * @param colourId The ID of the selected colour
   * @memberOf CreateSubcategoryComponent
   */
  onColourSelected(colourId: number): void {
    this.subcategory.subcategoryColourId = colourId;
  }

  /**
   * Method to handle form submission
   * @param formData The form data submitted
   * @memberOf CreateSubcategoryComponent
   */
  onSubmit(formData: Subcategory) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('authentication/login')
      return;
    }
    const loggedInUser = JSON.parse(storedUser);

    formData.subcategoryColourId = this.subcategory.subcategoryColourId;
    if (formData.subcategoryName === '' || formData.subcategoryColourId === 0) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.create-subcategory.alert_create_subcategory_missing_fields'), 'missing');
      return;
    }
    let categoryId = 0;
    this.route.params.subscribe(params => {
      categoryId = +params['categoryId'];
    });
    this.subcategoryService.insertSubcategory(loggedInUser.username, loggedInUser.password, categoryId, formData).subscribe({
      next: (response) => {
        this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`)
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
          this.localStorageService.removeItem('loggedInUser');
          this.router.navigateByUrl('/authentication/login');
        } else if (err.status === 400) {
          this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.create-subcategory.alert_create_subcategory_missing_fields'), 'missing');
        } else {
          this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
          console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.create-subcategory.console_error_creating_subcategory'), err);
        }
      }
    });
  }

  /**
   * Method to navigate back to subcategories
   * @memberOf CreateSubcategoryComponent
   */
  returnToSubcategories() {
    this.route.params.subscribe(params => {
      let categoryId = +params['categoryId'];
      this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`)
    });
  }
}
