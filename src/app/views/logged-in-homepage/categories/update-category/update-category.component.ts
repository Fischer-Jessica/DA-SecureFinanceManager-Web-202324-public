import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../../../logic/services/CategoryService';
import {LocalStorageService} from '../../../../logic/LocalStorageService';
import {Category} from '../../../../logic/models/Category';
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../../logic/services/SnackBarService";

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css', '../../logged-in-homepage.component.css']
})
/**
 * Component for updating a category
 * @class UpdateCategoryComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class UpdateCategoryComponent implements OnInit {
  /**
   * The category object to store category details
   * @type {Category}
   */
  category: Category = {} as Category;

  /**
   * Constructor for UpdateCategoryComponent
   * @param route The Angular ActivatedRoute service
   * @param router The Angular Router service
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @param categoryService The service for category operations
   * @param localStorageService The service for managing local storage
   * @memberOf UpdateCategoryComponent
   */
  constructor(private route: ActivatedRoute,
              private router: Router,
              private translateService: TranslateService,
              private snackBarService: SnackBarService,
              private categoryService: CategoryService,
              private localStorageService: LocalStorageService
  ) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf UpdateCategoryComponent
   */
  ngOnInit(): void {
    this.fetchCategory();
  }

  /**
   * Method to fetch category data for updating
   * @memberOf UpdateCategoryComponent
   */
  private fetchCategory(): void {
    const loggedInUser = this.localStorageService.getItem('loggedInUser');

    if (!loggedInUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
      this.router.navigateByUrl('authentication/login')
      return;
    }

    const user = JSON.parse(loggedInUser);

    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];

      if (isNaN(categoryId)) {
        this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
        this.router.navigate([`/logged-in-homepage/categories`]);
      }

      this.categoryService.getCategory(
        user.username,
        user.password,
        categoryId
      ).subscribe(
        result => this.category = result,
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.update-category.alert_category_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.categories.update-category.console_error_fetching_category'), error);
          }
        }
      );
    });
  }

  /**
   * Method to handle form submission for updating category
   * @param formData The form data submitted
   * @memberOf UpdateCategoryComponent
   */
  onSubmit(formData: any): void {
    if (this.category.categoryName === '' || this.category.categoryColourId === 0) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.create-category.alert_create_category_missing_fields'));
      return;
    }

    if (!formData.valid) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_invalid_formData'));
      return;
    }

    if (this.category.categoryId != null) {
      const user = JSON.parse(<string>this.localStorageService.getItem('loggedInUser'));

      this.categoryService.updateCategory(
        user.username,
        user.password,
        this.category.categoryId,
        this.category
      ).subscribe(
        result => this.router.navigateByUrl(`/logged-in-homepage/categories`),
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'));
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'));
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.update-category.alert_category_not_found'));
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'));
            console.error(this.translateService.instant('logged-in-homepage.categories.update-category.console_error_updating_category'), error);
          }
        }
      );
    }
  }

  /**
   * Method to cancel the update operation and navigate back
   * @memberOf UpdateCategoryComponent
   */
  onCancel(): void {
    this.router.navigateByUrl(`/logged-in-homepage/categories`);
  }

  /**
   * Callback function invoked when a colour is selected
   * @param colourId The ID of the selected colour
   * @memberOf UpdateCategoryComponent
   */
  onColourSelected(colourId: number): void {
    this.category.categoryColourId = colourId;
  }
}
