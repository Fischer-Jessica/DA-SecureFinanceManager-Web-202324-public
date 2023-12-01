import {Component} from '@angular/core';
import {Category} from "../../../logic/models/Category";
import {CategoryService} from "../../../logic/services/CategoryService";
import {UserService} from "../../../logic/services/UserService";

@Component({
  selector: 'logged-in-categories',
  templateUrl: './logged-in-categories.component.html',
  styleUrls: ['./logged-in-categories.component.css']
})
export class LoggedInCategoriesComponent {
  categories: Category[] = [];

  constructor(private apiService: CategoryService) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  private fetchCategories(): void {
    if (UserService.loggedInUser == null) {
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
}
