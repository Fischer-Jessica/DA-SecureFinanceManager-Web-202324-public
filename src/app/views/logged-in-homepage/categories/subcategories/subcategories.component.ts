import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../../logic/services/LocalStorageService";
import {Subcategory} from "../../../../logic/models/Subcategory";
import {SubcategoryService} from "../../../../logic/services/SubcategoryService";
import {ActivatedRoute, Router} from "@angular/router";
import {ColourService} from "../../../../logic/services/ColourService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../../logic/services/SnackBarService";

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css', '../../logged-in-homepage.component.css']
})

/**
 * Component for managing subcategories
 * @class SubcategoriesComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class SubcategoriesComponent implements OnInit {
  /**
   * Array to store subcategory data along with their corresponding colours
   * @type {{ subcategory: Subcategory; subcategoryColourHex: string, subcategorySum: number | undefined }[]}
   */
  subcategoriesData: {
    subcategory: Subcategory;
    subcategoryColourHex: string,
    subcategorySum: number | undefined
  }[] = [];

  /**
   * The categoryId in which the subcategory is located.
   * @type {number | undefined}
   */
  protected categoryId: number | undefined;

  /**
   * Constructor for SubcategoriesComponent
   * @param router The Angular Router service
   * @param route The Angular ActivatedRoute service
   * @param subcategoryService The service for subcategory operations
   * @param colourService The service for managing colours
   * @param localStorageService The service for managing local storage
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @param cdr The Angular ChangeDetectorRef service
   * @memberOf SubcategoriesComponent
   */
  constructor(
    private router: Router, private route: ActivatedRoute,
    private subcategoryService: SubcategoryService,
    private colourService: ColourService,
    private localStorageService: LocalStorageService,
    private translateService: TranslateService,
    private snackBarService: SnackBarService,
    private cdr: ChangeDetectorRef) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf SubcategoriesComponent
   */
  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];

        if (isNaN(this.categoryId)) {
          this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
          this.router.navigateByUrl('/logged-in-homepage/categories');
          return;
        }

        this.fetchSubcategories(loggedInUser.username, loggedInUser.password, this.categoryId);
      });
    } else {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
  }

  /**
   * Method to fetch subcategories data
   * @param username The username for authentication
   * @param password The password for authentication
   * @param categoryId The ID of the category to fetch subcategories for
   * @memberOf SubcategoriesComponent
   */
  private fetchSubcategories(username: string, password: string, categoryId: number): void {
    this.subcategoryService.getSubcategories(username, password, categoryId)
      .subscribe(
        (result) => {
          this.subcategoriesData = []; // Clear existing data
          for (let subcategory of result) {
            if (subcategory.subcategoryId !== null && subcategory.subcategoryId !== undefined) {
              this.fetchSubcategoryColourHex(subcategory);
            }
          }
        },
        (error) => {
          if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.alert_create_subcategory_first'), 'info');
          } else if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.console_error_fetching_subcategories'), error);
          }
        }
      );
  }

  /**
   * Fetches the colour hex code of a subcategory.
   * Retrieves the colour hex code of a subcategory from the backend and updates the subcategoriesData array.
   * If the subcategory ID is null, shows an error message and navigates to the categories page.
   * @param subcategory The subcategory object for which the colour hex code is to be fetched.
   * @memberOf SubcategoriesComponent
   */
  fetchSubcategoryColourHex(subcategory: Subcategory) {
    this.colourService.getColourHex(subcategory.subcategoryColourId).subscribe(
      (result) => {
        this.subcategoriesData.push({
          subcategory: subcategory,
          subcategoryColourHex: result,
          subcategorySum: undefined
        });
        this.subcategoriesData.sort((a, b) => {
          if (a.subcategory.subcategoryId !== undefined && b.subcategory.subcategoryId !== undefined) {
            return b.subcategory.subcategoryId - a.subcategory.subcategoryId;
          }
          return 0;
        });
        if (subcategory.subcategoryId != null) {
          this.fetchSubcategorySum(subcategory.subcategoryId);
        } else {
          this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
          this.router.navigate([`/logged-in-homepage/categories`]);
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

  /**
   * Retrieves the sum value of a subcategory.
   * Fetches the sum value of a subcategory from the backend and updates the subcategoriesData array.
   * Shows an error message and navigates to the categories page if the subcategory ID or category ID is null.
   * @param subcategoryId The ID of the subcategory for which the sum value is to be fetched.
   * @memberOf SubcategoriesComponent
   */
  fetchSubcategorySum(subcategoryId: number) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);

    if (this.categoryId != null && subcategoryId != null) {
      this.subcategoryService.getSubcategorySum(this.categoryId, subcategoryId, loggedInUser.username, loggedInUser.password).subscribe(
        (sumResult) => {
          const index = this.subcategoriesData.findIndex(data => data.subcategory.subcategoryId === subcategoryId);
          if (index !== -1) {
            this.subcategoriesData[index].subcategorySum = sumResult;
            this.cdr.detectChanges();
          }
        },
        (error) => {
          if (error.status === 404) {
            console.info(this.translateService.instant('logged-in-homepage.categories.subcategories.console_information_subcategory_sum'));
          } else if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.alert_parameter_subcategoryId_invalid'), 'error');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.console_error_subcategory_sum'), error);
          }
        }
      );
    } else {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
      this.router.navigateByUrl('/logged-in-homepage/categories');
      return;
    }
  }

  /**
   * Method to delete a subcategory
   * @param subcategoryId The ID of the subcategory to delete
   * @memberOf SubcategoriesComponent
   */
  deleteSubcategory(subcategoryId: number | undefined) {
    const confirmDelete = confirm(this.translateService.instant('logged-in-homepage.categories.subcategories.confirm_delete_subcategory'));
    if (!confirmDelete) {
      return; // Wenn der Benutzer die Aktion nicht bestätigt, breche den Löschvorgang ab
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (this.categoryId != null && subcategoryId != null) {
        this.subcategoryService
          .deleteSubcategory(user.username, user.password, this.categoryId, subcategoryId)
          .subscribe(
            (result) => {
              this.subcategoriesData = this.subcategoriesData.filter((item) => item.subcategory.subcategoryId !== subcategoryId);
              this.cdr.detectChanges();
            },
            (error) => {
              if (error.status === 401) {
                this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
                this.localStorageService.removeItem('loggedInUser');
                this.router.navigateByUrl('/authentication/login');
              } else if (error.status === 400) {
                this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.alert_parameter_subcategoryId_invalid'), 'error');
              } else if (error.status === 404) {
                this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.alert_subcategory_not_found'), 'error');
              } else {
                this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
                console.error(this.translateService.instant('logged-in-homepage.labels.console_error_deleting_label'), error);
              }
            }
          );
      } else {
        this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
        this.router.navigateByUrl('/logged-in-homepage/categories');
      }
    }
  }

  /**
   * Method to navigate to the page for adding a new subcategory
   * @memberOf SubcategoriesComponent
   */
  goToCreateSubcategoryPage() {
    this.router.navigateByUrl(`/logged-in-homepage/create-subcategory/${(this.categoryId)}`);
  }

  /**
   * Method to navigate to the entries associated with a subcategory
   * @param subcategoryId The ID of the subcategory
   * @memberOf SubcategoriesComponent
   */
  goToEntriesPage(subcategoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(subcategoryId)}`);
  }
}
