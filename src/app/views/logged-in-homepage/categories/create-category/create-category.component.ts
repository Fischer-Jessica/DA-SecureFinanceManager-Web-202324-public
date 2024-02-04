import {Component} from '@angular/core';
import {Category} from "../../../../logic/models/Category";
import {CategoryService} from "../../../../logic/services/CategoryService";
import {Router} from "@angular/router";
import {UserService} from "../../../../logic/services/UserService";
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
              private translate: TranslateService) {
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
    formData.categoryColourId = this.category.categoryColourId;
    if (UserService.loggedInUser == null) {
      this.showAlert(this.translate.instant('authorisation.alert_user_not_logged_in'));
      return;
    }
    this.categoryService.insertCategory(UserService.loggedInUser.username, UserService.loggedInUser.password,formData).subscribe({
      next: (response) => {
        this.router.navigateByUrl('/logged-in-homepage/categories')
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
