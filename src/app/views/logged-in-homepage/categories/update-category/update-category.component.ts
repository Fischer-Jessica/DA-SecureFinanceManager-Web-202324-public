import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../logic/services/CategoryService';
import { LocalStorageService } from '../../../../logic/LocalStorageService';
import { UserService } from '../../../../logic/services/UserService';
import { Category } from '../../../../logic/models/Category';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  category: Category = {} as Category;
  private categoryId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadCategoryData();
  }

  private loadCategoryData(): void {
    const loggedInUser = this.localStorageService.getItem('loggedInUser');

    if (!loggedInUser) {
      console.error('User is not logged in');
      return;
    }

    this.userService.loggedInUser = JSON.parse(loggedInUser);

    this.route.params.subscribe(params => {
      const categoryId = +params['categoryId'];

      if (isNaN(categoryId)) {
        console.error('Invalid categoryId provided in the route');
        return;
      }

      this.categoryService.getCategory(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        categoryId
      ).subscribe(
        result => this.category = result,
        error => console.error('Error fetching category:', error)
      );
    });
  }

  onSubmit(formData: any): void {
    if (!formData.valid) {
      console.error('Invalid form data provided');
      console.log(this.category)
      return;
    }

    console.log(this.category)

    if (this.category.categoryId != null) {
      this.categoryService.updateCategory(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        this.category.categoryId,
        this.category
      ).subscribe(
        result => this.router.navigateByUrl(`/logged-in-homepage/subcategories/${this.category.categoryId}`),
        error => console.error('Error updating category:', error)
      );
    }
  }

  onCancel(): void {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${this.category.categoryId}`);
  }

  onColourSelected(colourId: number): void {
    this.category.categoryColourId = colourId;
  }
}
