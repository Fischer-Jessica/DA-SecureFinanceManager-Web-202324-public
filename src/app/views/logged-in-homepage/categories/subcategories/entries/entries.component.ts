import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {UserService} from "../../../../../logic/services/UserService";
import {EntryService} from "../../../../../logic/services/EntryService";
import {Entry} from "../../../../../logic/models/Entry";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})

export class EntriesComponent implements OnInit {
  entries: Entry[] = [];
  protected subcategoryId: number | undefined;
  protected categoryId: number | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: EntryService, private localStorageService: LocalStorageService, private cdr: ChangeDetectorRef, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.subcategoryId = +params['subcategoryId'];
      });
      this.fetchEntries(this.subcategoryId);
    }
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  private fetchEntries(subcategoryId: number | undefined): void {
    console.log('fetching entries' + subcategoryId);
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    this.apiService.getEntriesBySubcategoryId(UserService.loggedInUser.username, UserService.loggedInUser.password, subcategoryId)
      .subscribe(
        (result) => {
          this.entries = result;
        },
        (error) => {
          if (error.status === 404) {
            this.showAlert('You need to create a entry.');
          } else if (error.status === 401) {
            this.showAlert('You are not authorized.');
          } else {
            this.showAlert('Error fetching entries');
          }
        }
      );
  }

  deleteEntry(entryId: number | undefined) {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    this.apiService.deleteEntry(UserService.loggedInUser.username, UserService.loggedInUser.password, this.subcategoryId, entryId)
      .subscribe(
        (result) => {
          console.log('Deleted entry:', result);
          this.entries = this.entries.filter((item) => item.entryId !== entryId);
          this.cdr.detectChanges(); // Trigger change detection
        },
        (error) => {
          console.error('Error deleting entry:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  updateEntry(entryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/update-entry/${(this.categoryId)}/${(this.subcategoryId)}/${entryId}`);
  }

  addEntry() {
    this.router.navigateByUrl(`/logged-in-homepage/create-entry/${(this.categoryId)}/${(this.subcategoryId)}`);
  }

  returnToSubcategory() {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${(this.categoryId)}`);
  }
}
