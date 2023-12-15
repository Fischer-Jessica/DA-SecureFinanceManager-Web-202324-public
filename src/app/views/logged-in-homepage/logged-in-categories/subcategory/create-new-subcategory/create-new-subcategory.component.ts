import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SubcategoryService} from "../../../../../logic/services/SubcategoryService";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {UserService} from "../../../../../logic/services/UserService";
import {Subcategory} from "../../../../../logic/models/Subcategory";
import {SubcategoryComponent} from "../subcategory.component";

@Component({
  selector: 'app-create-new-subcategory',
  templateUrl: './create-new-subcategory.component.html',
  styleUrls: ['./create-new-subcategory.component.css']
})
export class CreateNewSubcategoryComponent {
  subcategory: Subcategory = {
    subcategoryName: '',
    subcategoryColourId: 0,
    categoryId: 0,
  };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: SubcategoryService) {}

  onSubmit(formData: Subcategory) {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    let categoryId = 0;
    this.route.params.subscribe(params => {
      categoryId = +params['categoryId'];
    });
    this.apiService.insertSubcategory(UserService.loggedInUser.username, UserService.loggedInUser.password, categoryId, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl(`/logged-in-homepage/subcategory/${categoryId}`)
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  returnToSubcategories() {
    this.route.params.subscribe(params => {
      let categoryId = +params['categoryId'];
      this.router.navigateByUrl(`/logged-in-homepage/subcategory/${categoryId}`)
    });
  }
}
