import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {SubcategoryService} from "../../../../../logic/services/SubcategoryService";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {Subcategory} from "../../../../../logic/models/Subcategory";

@Component({
  selector: 'app-create-new-subcategory',
  templateUrl: './create-subcategory.component.html',
  styleUrls: ['./create-subcategory.component.css']
})
export class CreateSubcategoryComponent {
  subcategory: Subcategory = {
    subcategoryName: '',
    subcategoryColourId: 0,
    subcategoryCategoryId: 0,
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private apiService: SubcategoryService,
              private localStorageService: LocalStorageService) {
  }

  onColourSelected(colourId: number): void {
    this.subcategory.subcategoryColourId = colourId;
  }

  onSubmit(formData: Subcategory) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      console.error('User is not logged in');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);

    formData.subcategoryColourId = this.subcategory.subcategoryColourId;
    let categoryId = 0;
    this.route.params.subscribe(params => {
      categoryId = +params['categoryId'];
    });
    this.apiService.insertSubcategory(loggedInUser.username, loggedInUser.password, categoryId, formData).subscribe({
      next: (response) => {
        this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`)
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  returnToSubcategories() {
    this.route.params.subscribe(params => {
      let categoryId = +params['categoryId'];
      this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`)
    });
  }
}
