import {Component, OnInit} from '@angular/core';
import { Category } from '../../../logic/models/Category';
import { CategoryService } from '../../../logic/services/CategoryService';
import { UserService } from '../../../logic/services/UserService';
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {ColourService} from "../../../logic/services/ColourService";

@Component({
  selector: 'logged-in-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoriesData: { category: Category; colourName: string }[] = [];

  constructor(private router: Router, protected colourService: ColourService, private categoryService: CategoryService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.fetchCategories();
    }
  }

  private fetchCategories(): void {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    this.categoryService.getCategories(UserService.loggedInUser.username, UserService.loggedInUser.password)
      .subscribe(
        (result) => {
          for(let category of result) {
            this.colourService.getColourName(category.categoryColourId).subscribe(
              (result) => {
                this.categoriesData.push({
                  category: category,
                  colourName: result
                });
              },
              (error) => {
                console.error('Error fetching colour:', error);
                // Handle error (e.g., display an error message)
              }
            );

          }
        },
        (error) => {
          console.error('Error fetching categories:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

// In deiner aufrufenden Komponente
  showSubcategories(categoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`);
  }
}
