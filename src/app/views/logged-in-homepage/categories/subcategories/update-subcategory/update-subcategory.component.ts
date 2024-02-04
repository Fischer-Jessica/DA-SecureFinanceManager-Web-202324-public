import {Component, OnInit} from '@angular/core';
import {Subcategory} from "../../../../../logic/models/Subcategory";
import {ActivatedRoute, Router} from "@angular/router";
import {SubcategoryService} from "../../../../../logic/services/SubcategoryService";
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
              private localStorageService: LocalStorageService
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

    const user = JSON.parse(loggedInUser);

    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];
      const subcategoryId = +params['subcategoryId'];

      if (isNaN(subcategoryId)) {
        console.error('Invalid categoryId provided in the route');
        return;
      }

      this.subcategoryService.getSubcategory(
        user.username,
        user.password,
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
      const user = JSON.parse(<string>this.localStorageService.getItem('loggedInUser'));

      this.subcategoryService.updateSubcategory(
        user.username,
        user.password,
        this.subcategory
      ).subscribe(
        result => this.router.navigateByUrl(`logged-in-homepage/subcategories/${this.subcategory.subcategoryCategoryId}`),
        error => console.error('Error updating category:', error)
      );
    }
  }

  onCancel(): void {
    this.router.navigateByUrl(`logged-in-homepage/subcategories/${this.subcategory.subcategoryCategoryId}`);
  }

  onColourSelected(colourId: number): void {
    this.subcategory.subcategoryColourId = colourId;
  }
}
