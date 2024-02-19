import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../../logic/LocalStorageService";
import {Subcategory} from "../../../../logic/models/Subcategory";
import {SubcategoryService} from "../../../../logic/services/SubcategoryService";
import {ActivatedRoute, Router} from "@angular/router";
import {ColourService} from "../../../../logic/services/ColourService";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategories.component.html',
  styleUrls: ['./subcategories.component.css']
})
export class SubcategoriesComponent implements OnInit {
  subcategoriesData: { subcategory: Subcategory; colourHex: string }[] = [];
  protected categoryId: number | undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private colourService: ColourService,
              private apiService: SubcategoryService,
              private localStorageService: LocalStorageService,
              private cdr: ChangeDetectorRef,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.fetchSubcategories(user.username, user.password, this.categoryId);
      });
    }
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  private fetchSubcategories(username: string, password: string, categoryId: number): void {
    this.apiService.getSubcategories(username, password, categoryId)
      .subscribe(
        (result) => {
          this.subcategoriesData = []; // Clear existing data
          for (let subcategory of result) {
            if (subcategory.subcategoryId !== null && subcategory.subcategoryId !== undefined) { // Check if subcategoryId is not null or undefined
              this.colourService.getColourHex(subcategory.subcategoryColourId).subscribe(
                (result) => {
                  this.subcategoriesData.push({
                    subcategory: subcategory,
                    colourHex: result
                  });
                  // Sort subcategoriesData after each new entry
                  this.subcategoriesData.sort((a, b) => {
                    if (a.subcategory.subcategoryId !== undefined && b.subcategory.subcategoryId !== undefined) {
                      return a.subcategory.subcategoryId - b.subcategory.subcategoryId;
                    }
                    return 0;
                  });
                },
                (error) => {
                  console.error('Error fetching colour:', error);
                  // Handle error (e.g., display an error message)
                }
              );
            }
          }
        },
        (error) => {
          if (error.status === 404) {
            this.showAlert('You need to create a subcategory.');
          } else if (error.status === 401) {
            this.showAlert('You are not authorized.');
          } else {
            this.showAlert('Error fetching subcategories');
          }
        }
      );
  }

  // TODO: Den User fragen, ob er wirklich löschen möchte
  deleteSubcategory(subcategoryId: number | undefined) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.apiService
        .deleteSubcategory(user.username, user.password, this.categoryId, subcategoryId)
        .subscribe(
          (result) => {
            this.subcategoriesData = this.subcategoriesData.filter((item) => item.subcategory.subcategoryId !== subcategoryId);
            this.cdr.detectChanges(); // Trigger change detection
          },
          (error) => {
            console.error('Error deleting subcategory:', error);
            window.location.reload();
          }
        );
    }
  }

  addSubcategory() {
    this.router.navigateByUrl(`/logged-in-homepage/create-subcategory/${(this.categoryId)}`);
  }

  showEntries(subcategoryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(subcategoryId)}`);
  }
}
