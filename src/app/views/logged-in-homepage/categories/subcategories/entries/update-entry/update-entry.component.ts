import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../../../../../../logic/services/LocalStorageService";
import {EntryService} from "../../../../../../logic/services/EntryService";
import {ActivatedRoute, Router} from "@angular/router";
import {Entry} from "../../../../../../logic/models/Entry";
import {SnackBarService} from "../../../../../../logic/services/SnackBarService";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-update-entry',
  templateUrl: './update-entry.component.html',
  styleUrls: ['./update-entry.component.css', '../create-entry/create-entry.component.css', '../../../../logged-in-homepage.component.css', '../../../../../../app.component.css']
})

/**
 * Component for updating an entry
 * @class UpdateEntryComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class UpdateEntryComponent implements OnInit {
  /**
   * The entry object to store entry details
   * @type {Entry}
   */
  entry: Entry = {} as Entry;

  /**
   * The categoryId in which the subcategory is located
   * @type {number}
   */
  private categoryId: number | undefined;

  /**
   * The subcategoryId in which the entry is located
   * @type {number}
   */
  private subcategoryId: number | undefined;

  /**
   * Constructor for UpdateEntryComponent
   * @param router The Angular Router service
   * @param route The Angular ActivatedRoute service
   * @param entryService The service for entry operations
   * @param localStorageService The service for managing local storage
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @memberOf UpdateEntryComponent
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private entryService: EntryService,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf UpdateEntryComponent
   */
  ngOnInit(): void {
    this.fetchEntry();
  }

  /**
   * Method to load the entry to be updated
   * @memberOf UpdateEntryComponent
   */
  private fetchEntry() {
    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('authentication/login')
      return;
    }

    const user = JSON.parse(storedUser);

    this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId'];
      this.subcategoryId = +params['subcategoryId'];
      const entryId = +params['entryId'];

      if (isNaN(this.categoryId) || isNaN(this.subcategoryId) || isNaN(entryId)) {
        this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
        this.router.navigate([`/logged-in-homepage/categories`]);
      }

      this.entryService.getEntry(
        user.username,
        user.password,
        this.subcategoryId,
        entryId
      ).subscribe(
        result => {
          this.entry = result;
          this.setInitialDateTimeFromDatabase(this.entry.entryTimeOfTransaction);
        },
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.update-entry.alert_entry_not_found'), 'error');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.update-entry.console_error_fetching_entry'), error);
          }
        }
      );
    });
  }

  /**
   * Sets the initial date and time for an entry based on the provided database date-time string.
   * The database date-time string is expected to be in the format 'YYYY-MM-DD HH:mm'.
   * @param databaseDateTime The date-time string retrieved from the database.
   * @memberOf UpdateEntryComponent
   */
  setInitialDateTimeFromDatabase(databaseDateTime: string) {
    // Split the input string into the date and time parts
    const [datePart, timePart] = databaseDateTime.split(' ');

    // Split the date part into day, month, year
    const [day, month, year] = datePart.split('.');

    // Split the time part into hours and minutes
    const [hours, minutes] = timePart.split(':');

    // Format and set the ISO datetime string (YYYY-MM-DDTHH:MM)
    this.entry.entryTimeOfTransaction = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  /**
   * Method to handle form submission
   * @param updatedEntryFormData The form data submitted
   * @memberOf UpdateEntryComponent
   */
  onSubmit(updatedEntryFormData: Entry) {
    if (updatedEntryFormData.entryAmount === null || updatedEntryFormData.entryTimeOfTransaction === '') {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.create-entry.alert_create_entry_missing_fields'), 'missing');
      return;
    }

    if (!updatedEntryFormData.entryAmount.toString().match(/^(-)?\d+(\.\d{0,2})?$/)) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.create-entry.alert_invalid_amount'), 'invalid');
      return;
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('authentication/login')
      return;
    }

    const [date, time] = this.entry.entryTimeOfTransaction.split('T');
    const [year, month, day] = date.split('-');

    this.entry.entryTimeOfTransaction = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year} ${time}`;

    const user = JSON.parse(storedUser);

    if (this.entry.entryId != null && this.subcategoryId != null) {
      this.entryService.updateEntry(
        user.username,
        user.password,
        this.subcategoryId,
        this.entry
      ).subscribe(
        result => this.router.navigate([`/logged-in-homepage/entries/${this.categoryId}/${this.subcategoryId}`]),
        error => {
          if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.router.navigateByUrl('authentication/login')
          } else if (error.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
            this.router.navigate([`/logged-in-homepage/categories`]);
          } else if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.update-entry.alert_entry_not_found'), 'error');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.update-entry.console_error_fetching_entry'), error);
          }
        }
      );
    } else {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
      this.router.navigate([`/logged-in-homepage/categories`]);
    }
  }

  /**
   * Method to cancel the update operation and navigate back
   * @memberOf UpdateEntryComponent
   */
  goToEntriesPage(): void {
    this.router.navigate([`/logged-in-homepage/entries/${this.categoryId}/${this.subcategoryId}`]);
  }
}
