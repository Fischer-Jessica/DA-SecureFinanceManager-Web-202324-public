import { Component } from '@angular/core';
import {LocalStorageService} from "../../../../logic/LocalStorageService";
import {UserService} from "../../../../logic/services/UserService";
import {Subcategory} from "../../../../logic/models/Subcategory";
import {SubcategoryService} from "../../../../logic/services/SubcategoryService";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.css']
})
export class SubcategoryComponent {
  subcategories: Subcategory[] = [];

  constructor(private route: ActivatedRoute, private apiService: SubcategoryService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        const categoryId = +params['categoryId'];
        this.fetchSubcategories(categoryId);
      });
    }
  }

  private fetchSubcategories(categoryId: number): void {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    this.apiService.getSubcategories(UserService.loggedInUser.username, UserService.loggedInUser.password, categoryId)
      .subscribe(
        (result) => {
          this.subcategories = result;
        },
        (error) => {
          console.error('Error fetching subcategories:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }
}
