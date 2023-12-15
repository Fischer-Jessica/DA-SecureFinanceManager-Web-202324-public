import {Component, OnInit} from '@angular/core';
import { Category } from '../../../logic/models/Category';
import { CategoryService } from '../../../logic/services/CategoryService';
import { UserService } from '../../../logic/services/UserService';
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";

@Component({
  selector: 'logged-in-categories',
  templateUrl: './logged-in-categories.component.html',
  styleUrls: ['./logged-in-categories.component.css'],
})
export class LoggedInCategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private router: Router, private apiService: CategoryService, private localStorageService: LocalStorageService) {}

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
    this.apiService.getCategories(UserService.loggedInUser.username, UserService.loggedInUser.password)
      .subscribe(
        (result) => {
          this.categories = result;
        },
        (error) => {
          console.error('Error fetching categories:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

// In deiner aufrufenden Komponente
  showSubcategories(categoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/subcategory/${categoryId}`);
  }
}
