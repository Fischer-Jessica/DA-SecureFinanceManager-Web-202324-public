import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../../logic/LocalStorageService";
import {UserService} from "../../../../logic/services/UserService";
import {Subcategory} from "../../../../logic/models/Subcategory";
import {SubcategoryService} from "../../../../logic/services/SubcategoryService";
import {ActivatedRoute, Router} from "@angular/router";
import {ColourService} from "../../../../logic/services/ColourService";

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit {
  subcategoriesData: { subcategory: Subcategory; colourName: string }[] = [];
  protected categoryId: number | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private colourService: ColourService,
              private apiService: SubcategoryService,
              private localStorageService: LocalStorageService,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.fetchSubcategories(this.categoryId);
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
          for (let subcategory of result) {
            this.colourService.getColourName(subcategory.subcategoryColourId).subscribe(
              (result) => {
                this.subcategoriesData.push({
                  subcategory: subcategory,
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
          console.error('Error fetching subcategories:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  deleteSubcategory(subcategoryId: number | undefined) {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }

    this.apiService
      .deleteSubcategory(UserService.loggedInUser.username, UserService.loggedInUser.password, this.categoryId, subcategoryId)
      .subscribe(
        (result) => {
          console.log('Deleted subcategory:', result);
          // Nach dem Löschen die Kategorie aus dem categoriesData-Array entfernen
          this.subcategoriesData = this.subcategoriesData.filter((item) => item.subcategory.subcategoryId !== subcategoryId);
          this.cdr.detectChanges(); // Trigger change detection
          // Handle result (e.g., display success message)
        },
        (error) => {
          console.error('Error deleting subcategory:', error);
          window.location.reload();
        }
      );
  }

  addSubcategory() {
    this.router.navigateByUrl(`/logged-in-homepage/create-subcategory/${(this.categoryId)}`);
  }

  showEntries(subcategoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(subcategoryId)}`);
  }
}
