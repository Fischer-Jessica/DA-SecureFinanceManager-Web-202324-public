import { Component } from '@angular/core';
import {Category} from "../../../../logic/models/Category";
import {CategoryService} from "../../../../logic/services/CategoryService";
import {Router} from "@angular/router";
import {UserService} from "../../../../logic/services/UserService";

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

  constructor(private categoryService: CategoryService, private router: Router) {
  }

  onColourSelected(colourId: number): void {
    console.log('Received colourId:', colourId);
    this.category.categoryColourId = colourId;
  }

  onSubmit(formData: Category) {
    formData.categoryColourId = this.category.categoryColourId;
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    this.categoryService.insertCategory(UserService.loggedInUser.username, UserService.loggedInUser.password,formData).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('/logged-in-homepage/categories')
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
