import {Component} from '@angular/core';
import {Category} from "../../../../logic/models/Category";
import {CategoryService} from "../../../../logic/services/CategoryService";
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../../logic/LocalStorageService";
import {TranslateService} from "@ngx-translate/core";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-new-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent {
  category: Category = {
    categoryName: '',
    categoryColourId: 0,
  };

  constructor(private categoryService: CategoryService,
              private router: Router,
              private snackBar: MatSnackBar,
              private translate: TranslateService,
              private localStorageService: LocalStorageService) {
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  onColourSelected(colourId: number): void {
    this.category.categoryColourId = colourId;
  }

  onSubmit(formData: Category) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.showAlert(this.translate.instant('authentication.alert_user_not_logged_in'));
      return;
    }
    const loggedInUser = JSON.parse(storedUser);

    formData.categoryColourId = this.category.categoryColourId;
    this.categoryService.insertCategory(loggedInUser.username, loggedInUser.password, formData).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage/categories')
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
