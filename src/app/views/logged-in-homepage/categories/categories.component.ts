import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Category} from '../../../logic/models/Category';
import {CategoryService} from '../../../logic/services/CategoryService';
import {UserService} from '../../../logic/services/UserService';
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {ColourService} from "../../../logic/services/ColourService";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'logged-in-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoriesData: { category: Category; colourHex: string }[] = [];

  constructor(private router: Router,
              protected colourService: ColourService,
              private categoryService: CategoryService,
              private localStorageService: LocalStorageService,
              private cdr: ChangeDetectorRef,
              private snackBar: MatSnackBar,
              private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.fetchCategories();
    }
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  private fetchCategories(): void {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    this.categoryService
      .getCategories(UserService.loggedInUser.username, UserService.loggedInUser.password)
      .subscribe(
        (result) => {
          this.categoriesData = []; // Clear existing data
          for (let category of result) {
            this.colourService.getColourHex(category.categoryColourId).subscribe(
              (result) => {
                this.categoriesData.push({
                  category: category,
                  colourHex: result,
                });
              },
              (error) => {
                console.error('Error fetching colour:', error);
                // Handle error (e.g., display an error message)
              }
            );
          }
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          if (error.status === 404) {
            this.showAlert(this.translate.instant('logged-in-homepage.categories.alert_create_category_first'));
          } else if (error.status === 401) {
            this.showAlert(this.translate.instant('authorisation.alert_user_not_logged_in'));
          } else {
            this.showAlert(this.translate.instant('logged-in-homepage.categories.alert_error_fetching_categories'));
          }
        }
      );
  }

  deleteCategory(categoryId: number | undefined) {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }

    this.categoryService
      .deleteCategory(UserService.loggedInUser.username, UserService.loggedInUser.password, categoryId)
      .subscribe(
        (result) => {
          this.categoriesData = this.categoriesData.filter((item) => item.category.categoryId !== categoryId);
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          this.showAlert(this.translate.instant('categories.alert_error_deleting_category'));
          window.location.reload();
        }
      );
  }

// In deiner aufrufenden Komponente
  showSubcategories(categoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`);
  }
}
