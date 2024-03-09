import {Component} from '@angular/core';
import {Category} from "../../../../logic/models/Category";
import {CategoryService} from "../../../../logic/services/CategoryService";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../../logic/services/LocalStorageService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../../logic/services/SnackBarService";

@Component({
  selector: 'app-create-new-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css', '../../logged-in-homepage.component.css', '../../../../app.component.css']
})

/**
 * Component for creating a new category
 * @class CreateCategoryComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class CreateCategoryComponent {
  /**
   * The category object to store category details
   * @type {Category}
   */
  category: Category = {
    categoryName: '',
    categoryColourId: 0,
  };

  /**
   * Constructor for CreateCategoryComponent
   * @param router The Angular router service
   * @param categoryService The service for category operations
   * @param localStorageService The service for managing local storage
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @memberOf CreateCategoryComponent
   */
  constructor(private router: Router,
              private categoryService: CategoryService,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Callback function invoked when a colour is selected
   * @param colourId The ID of the selected colour
   * @memberOf CreateCategoryComponent
   */
  onColourSelected(colourId: number): void {
    this.category.categoryColourId = colourId;
  }

  /**
   * Method to handle form submission
   * @param newCategoryFormData The form data submitted
   * @memberOf CreateCategoryComponent
   */
  onSubmit(newCategoryFormData: Category) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);

    newCategoryFormData.categoryColourId = this.category.categoryColourId;

    if (newCategoryFormData.categoryName === '' || newCategoryFormData.categoryColourId === 0) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.create-category.alert_create_category_missing_fields'), 'missing');
      return;
    }

    this.categoryService.insertCategory(loggedInUser.username, loggedInUser.password, newCategoryFormData).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage/categories')
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
          this.localStorageService.removeItem('loggedInUser');
          this.router.navigateByUrl('/authentication/login');
        } else if (err.status === 400) {
          this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.create-category.alert_create_category_missing_fields'), 'missing');
        } else {
          this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
          console.error(this.translateService.instant('logged-in-homepage.categories.create-category.console_error_creating_category'), err);
        }
      }
    });
  }
}
