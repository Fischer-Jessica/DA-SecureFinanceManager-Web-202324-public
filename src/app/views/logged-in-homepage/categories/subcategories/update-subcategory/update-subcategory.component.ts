import {Component, OnInit} from '@angular/core';
import {Subcategory} from "../../../../../logic/models/Subcategory";
import {ActivatedRoute, Router} from "@angular/router";
import {SubcategoryService} from "../../../../../logic/services/SubcategoryService";
import {UserService} from "../../../../../logic/services/UserService";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";

@Component({
  selector: 'app-update-subcategory',
  templateUrl: './update-subcategory.component.html',
  styleUrls: ['./update-subcategory.component.css']
})
export class UpdateSubcategoryComponent implements OnInit {
  subcategory: Subcategory = {} as Subcategory;
  subcategoryId: number | undefined = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private subcategoryService: SubcategoryService,
              private localStorageService: LocalStorageService,
              private userService: UserService
  ) {
  }

  ngOnInit() {
    this.loadSubcategoryData();
  }

  private loadSubcategoryData(): void {
    const loggedInUser = this.localStorageService.getItem('loggedInUser');

    if (!loggedInUser) {
      console.error('User is not logged in');
      return;
    }

    this.userService.loggedInUser = JSON.parse(loggedInUser);

    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];
      const subcategoryId = +params['subcategoryId'];

      if (isNaN(subcategoryId)) {
        console.error('Invalid categoryId provided in the route');
        return;
      }

      this.subcategoryService.getSubcategory(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        categoryId,
        subcategoryId
      ).subscribe(
        result => {
          this.subcategory = result;
          this.subcategoryId = result.subcategoryId;
        },
        error => console.error('Error fetching category:', error)
      );
    });
  }

  onSubmit(formData: any): void {
    if (!formData.valid) {
      console.error('Invalid form data provided');
      return;
    }

    if (this.subcategory.subcategoryId != null) {
      this.subcategory.subcategoryId = this.subcategoryId;
      this.subcategoryService.updateSubcategory(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        this.subcategory
      ).subscribe(
        result => this.router.navigateByUrl(`logged-in-homepage/entries/${this.subcategory.subcategoryCategoryId}/${this.subcategory.subcategoryId}`),
        error => console.error('Error updating category:', error)
      );
    }
  }

  onCancel(): void {
    this.router.navigateByUrl(`logged-in-homepage/entries/${this.subcategory.subcategoryCategoryId}/${this.subcategory.subcategoryId}`);
  }

  onColourSelected(colourId: number): void {
    this.subcategory.subcategoryColourId = colourId;
  }
}
