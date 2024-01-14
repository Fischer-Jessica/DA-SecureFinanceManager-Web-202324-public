import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
  categoriesData: { category: Category; colourHex: string }[] = [];

  constructor(
    private router: Router,
    protected colourService: ColourService,
    private categoryService: CategoryService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

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
    this.categoryService
      .getCategories(UserService.loggedInUser.username, UserService.loggedInUser.password)
      .subscribe(
        (result) => {
          this.categoriesData = []; // Clear existing data
          for (let category of result) {
            this.colourService.getColourHex(category.categoryColourId).subscribe(
              (result) => {
                this.categoriesData.push({
                  category: category,
                  colourHex: result,
                });
              },
              (error) => {
                console.error('Error fetching colour:', error);
                // Handle error (e.g., display an error message)
              }
            );
          }
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          console.error('Error fetching categories:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  deleteCategory(categoryId: number | undefined) {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }

    this.categoryService
      .deleteCategory(UserService.loggedInUser.username, UserService.loggedInUser.password, categoryId)
      .subscribe(
        (result) => {
          console.log('Deleted category:', result);
          // Nach dem Löschen die Kategorie aus dem categoriesData-Array entfernen
          this.categoriesData = this.categoriesData.filter((item) => item.category.categoryId !== categoryId);
          this.cdr.detectChanges(); // Trigger change detection
          // Handle result (e.g., display success message)
        },
        (error) => {
          console.error('Error deleting category:', error);
          window.location.reload();
        }
      );
  }

// In deiner aufrufenden Komponente
  showSubcategories(categoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${categoryId}`);
  }
}
