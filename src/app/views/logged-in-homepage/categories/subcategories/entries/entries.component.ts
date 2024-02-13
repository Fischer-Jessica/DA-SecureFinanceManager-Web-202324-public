import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {EntryService} from "../../../../../logic/services/EntryService";
import {Entry} from "../../../../../logic/models/Entry";
import {MatSnackBar, MatSnackBarConfig} from "@angular/material/snack-bar";
import {LabelService} from "../../../../../logic/services/LabelService";
import {EntryLabelService} from "../../../../../logic/services/EntryLabelService";
import {Label} from "../../../../../logic/models/Label";

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})

export class EntriesComponent implements OnInit {
  entries: Entry[] = [];
  protected subcategoryId: number | undefined;
  protected categoryId: number | undefined;
  protected selectedLabelForEntries: Map<number, Label[]> = new Map<number, Label[]>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entryService: EntryService,
              private labelService: LabelService,
              private entryLabelService: EntryLabelService,
              private localStorageService: LocalStorageService,
              private cdr: ChangeDetectorRef,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.subcategoryId = +params['subcategoryId'];
      });
      this.fetchEntries(this.subcategoryId, loggedInUser.username, loggedInUser.password);
    }
  }

  showAlert(message: string): void {
    const config = new MatSnackBarConfig();
    config.duration = 10000; // Anzeigedauer des Alerts in Millisekunden
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top'; // Positionierung oben auf der Website

    this.snackBar.open(message, 'Close', config);
  }

  fetchLabelsOfEntry(username: string, password: string): void {
    for (const entry of this.entries) {
      this.entryLabelService.getLabelsByEntryId(username, password, entry.entryId)
        .subscribe(
          (result) => {
            if (entry.entryId != null) {
              this.selectedLabelForEntries.set(entry.entryId, result);
            }
          },
          (error) => {
            console.error('Error fetching labels of entry:', error);
            // Handle error (e.g., display an error message)
          }
        );
    }
  }

  private fetchEntries(subcategoryId: number | undefined, username: string, password: string): void {
    this.entryService.getEntriesBySubcategoryId(username, password, subcategoryId)
      .subscribe(
        (result) => {
          this.entries = result;
          this.fetchLabelsOfEntry(username, password);
        },
        (error) => {
          if (error.status === 404) {
            this.showAlert('You need to create an entry.');
          } else if (error.status === 401) {
            this.showAlert('You are not authorized.');
          } else {
            this.showAlert('Error fetching entries');
          }
        }
      );
  }

  deleteEntry(entryId: number | undefined) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      console.error('User is not logged in');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);
    this.entryService.deleteEntry(loggedInUser.username, loggedInUser.password, this.subcategoryId, entryId)
      .subscribe(
        (result) => {
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

  getLabels(entryId: number | undefined) {
    return this.selectedLabelForEntries.get(typeof entryId === "number" ? entryId : -1);
  }
}
