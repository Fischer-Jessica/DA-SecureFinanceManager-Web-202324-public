import {Component, OnInit} from '@angular/core';
import {Subcategory} from "../../../../../logic/models/Subcategory";
import {ActivatedRoute, Router} from "@angular/router";
import {SubcategoryService} from "../../../../../logic/services/SubcategoryService";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {SnackBarService} from "../../../../../logic/services/SnackBarService";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-update-subcategory',
  templateUrl: './update-subcategory.component.html',
  styleUrls: ['./update-subcategory.component.css', '../../../logged-in-homepage.component.css', '../../../../../app.component.css']
})

/**
 * Component for updating a subcategory
 * @class UpdateSubcategoryComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class UpdateSubcategoryComponent implements OnInit {
  /**
   * The subcategory object to store subcategory details
   * @type {Subcategory}
   */
  subcategory: Subcategory = {} as Subcategory;

  /**
   * The ID of the subcategory
   * @type {number}
   */
  subcategoryId: number | undefined = 0;


  /**
   * Constructor for UpdateSubcategoryComponent
   * @param router The Angular Router service
   * @param route The Angular ActivatedRoute service
   * @param subcategoryService The service for subcategory operations
   * @param localStorageService The service for managing local storage
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @memberOf UpdateSubcategoryComponent
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private subcategoryService: SubcategoryService,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private snackBarService: SnackBarService,
  ) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf UpdateSubcategoryComponent
   */
  ngOnInit() {
    this.fetchSubcategory();
  }

  /**
   * Method to load subcategory data for updating
   * @memberOf UpdateSubcategoryComponent
   */
  private fetchSubcategory(): void {
    const loggedInUser = this.localStorageService.getItem('loggedInUser');

    if (!loggedInUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
      this.router.navigateByUrl('authentication/login')
      return;
    }

    const user = JSON.parse(loggedInUser);

    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];
      const subcategoryId = +params['subcategoryId'];

      if (isNaN(categoryId) || isNaN(subcategoryId)) {
        this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
        this.router.navigate([`/logged-in-homepage/categories`]);
      }

      this.subcategoryService.getSubcategory(
        user.username,
        user.password,
        categoryId,
        subcategoryId
      ).subscribe(
        result => {
          this.subcategory = result;
          this.subcategoryId = result.subcategoryId;
        },
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.update-subcategory.alert_subcategory_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.update-subcategory.console_error_fetching_subcategory'), error);
          }
        }
      );
    });
  }

  /**
   * Method to handle form submission for updating subcategory
   * @param formData The form data submitted
   * @memberOf UpdateSubcategoryComponent
   */
  onSubmit(formData: any): void {
    if (this.subcategory.subcategoryName === '' || this.subcategory.subcategoryColourId === 0) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.create-subcategory.alert_create_subcategory_missing_fields'));
      return;
    }

    if (!formData.valid) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_invalid_formData'));
      return;
    }

    if (this.subcategory.subcategoryId != null) {
      this.subcategory.subcategoryId = this.subcategoryId;
      const user = JSON.parse(<string>this.localStorageService.getItem('loggedInUser'));

      this.subcategoryService.updateSubcategory(
        user.username,
        user.password,
        this.subcategory
      ).subscribe(
        result => this.router.navigateByUrl(`logged-in-homepage/subcategories/${this.subcategory.subcategoryCategoryId}`),
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.update-subcategory.alert_subcategory_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.update-subcategory.console_error_updating_subcategory'), error);
          }
        }
      );
    }
  }

  /**
   * Method to cancel the update operation and navigate back
   * @memberOf UpdateSubcategoryComponent
   */
  onCancel(): void {
    this.router.navigateByUrl(`logged-in-homepage/subcategories/${this.subcategory.subcategoryCategoryId}`);
  }

  /**
   * Callback function invoked when a colour is selected
   * @param colourId The ID of the selected colour
   * @memberOf UpdateSubcategoryComponent
   */
  onColourSelected(colourId: number): void {
    this.subcategory.subcategoryColourId = colourId;
  }
}
