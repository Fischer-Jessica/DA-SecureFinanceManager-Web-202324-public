import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Category} from '../../../logic/models/Category';
import {CategoryService} from '../../../logic/services/CategoryService';
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {ColourService} from "../../../logic/services/ColourService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../logic/services/SnackBarService";

@Component({
  selector: 'logged-in-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css', '../logged-in-homepage.component.css'],
})
/**
 * Component for managing categories
 * @class CategoriesComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class CategoriesComponent implements OnInit {
  /**
   * Array to store category data along with their corresponding colours
   * @type {{ category: Category; colourHex: string }[]}
   */
  categoriesData: { category: Category; colourHex: string; categorySum: number | undefined }[] = [];

  /**
   * Constructor for CategoriesComponent
   * @param router The Angular Router service
   * @param categoryService The service for category operations
   * @param colourService The service for managing colours
   * @param localStorageService The service for managing local storage
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @param cdr The Angular ChangeDetectorRef service
   * @memberOf CategoriesComponent
   */
  constructor(private router: Router,
              private categoryService: CategoryService,
              protected colourService: ColourService,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService,
              private cdr: ChangeDetectorRef
  ) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf CategoriesComponent
   */
  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);
    this.fetchCategories(loggedInUser);
  }

  /**
   * Method to delete a category
   * @param categoryId The ID of the category to delete
   * @memberOf CategoriesComponent
   */
  deleteCategory(categoryId: number | undefined) {
    const confirmDelete = confirm(this.translateService.instant('logged-in-homepage.categories.confirm_delete_category'));
    if (!confirmDelete) {
      return; // Wenn der Benutzer die Aktion nicht bestätigt, breche den Löschvorgang ab
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    this.categoryService
      .deleteCategory(loggedInUser.username, loggedInUser.password, categoryId)
      .subscribe(
        (result) => {
          this.categoriesData = this.categoriesData.filter((item) => item.category.categoryId !== categoryId);
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.alert_parameter_categoryId_invalid'), 'error');
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.alert_category_not_found'), 'error');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.console_error_deleting_category'), error);
          }
        }
      );
  }

  /**
   * Method to fetch categories data
   * @memberOf CategoriesComponent
   */
  private fetchCategories(loggedInUser: any): void {
    this.categoryService
      .getCategories(loggedInUser.username, loggedInUser.password)
      .subscribe(
        (result) => {
          this.categoriesData = []; // Clear existing data
          for (let category of result) {
            if (category.categoryId !== null) { // Check if categoryId is not null
              this.colourService.getColourHex(category.categoryColourId).subscribe(
                (colourResult) => {
                  this.categoriesData.push({
                    category: category,
                    colourHex: colourResult,
                    categorySum: undefined // Set value to undefined initially
                  });
                  this.categoriesData.sort((a, b) => {
                    if (a.category.categoryId !== undefined && b.category.categoryId !== undefined) {
                      return b.category.categoryId - a.category.categoryId;
                    }
                    return 0;
                  });
                  // Now fetch the value
                  if (category.categoryId != null) {
                    this.categoryService.getCategorySum(category.categoryId, loggedInUser.username, loggedInUser.password).subscribe(
                      (sumResult) => {
                        // Find the corresponding entry in categoriesData and update its value
                        const index = this.categoriesData.findIndex(data => data.category.categoryId === category.categoryId);
                        if (index !== -1) {
                          this.categoriesData[index].categorySum = sumResult;
                          this.cdr.detectChanges(); // Trigger change detection after updating the value
                        }
                      },
                      (error) => {
                        if (error.status === 404) {
                          console.info(this.translateService.instant('logged-in-homepage.categories.subcategories.console_information_category_sum'));
                        } else if (error.status === 401) {
                          this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
                          this.localStorageService.removeItem('loggedInUser');
                          this.router.navigateByUrl('/authentication/login');
                        } else if (error.status === 400) {
                          this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.alert_parameter_categoryId_invalid'), 'error');
                        } else {
                          this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
                          console.error(this.translateService.instant('logged-in-homepage.categories.console_error_category_sum'), error);
                        }
                      }
                    );
                  }
                },
                (error) => {
                  if (error.status === 404) {
                    this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.colours.alert_colours_not_found'), 'error');
                  } else {
                    this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
                    console.error(this.translateService.instant('logged-in-homepage.colours.console_error_fetching_colours'), error);
                  }
                }
              );
            }
          }
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.alert_create_category_first'), 'info');
          } else if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.console_error_fetching_categories'), error);
          }
        }
      );
  }

  /**
   * Method to navigate to the subcategories of a category
   * @param categoryId The ID of the category
   * @memberOf CategoriesComponent
   */
  showSubcategories(categoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`);
  }
}
