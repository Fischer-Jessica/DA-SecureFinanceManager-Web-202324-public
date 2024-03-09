import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EntryService} from "../../../../../../logic/services/EntryService";
import {Entry} from "../../../../../../logic/models/Entry";
import {LocalStorageService} from "../../../../../../logic/services/LocalStorageService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../../../../logic/services/SnackBarService";

@Component({
  selector: 'app-create-entry',
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.css', '../../../../logged-in-homepage.component.css', '../../../../../../app.component.css']
})

/**
 * Component for creating a new entry
 * @class CreateEntryComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class CreateEntryComponent implements OnInit {
  /**
   * The entry object to store entry details
   * @type {Entry}
   */
  entry: Entry = {
    subcategoryId: 0,
    entryAmount: 0,
    entryTimeOfTransaction: ''
  };

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
   * Constructor for CreateEntryComponent
   * @param router The Angular Router service
   * @param route The Angular ActivatedRoute service
   * @param entryService The service for entry operations
   * @param localStorageService The service for managing local storage
   * @param translateService The service for translation
   * @param snackBarService The service for displaying snack bar messages
   * @memberOf CreateEntryComponent
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private entryService: EntryService,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService) {
  }

  /**
   * Lifecycle hook called after component initialization
   * @memberOf CreateEntryComponent
   */
  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.subcategoryId = +params['subcategoryId'];
        if (isNaN(this.categoryId) || isNaN(this.subcategoryId)) {
          this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
          this.router.navigate([`/logged-in-homepage/categories`]);
        }
      });
      this.setInitialDateTime();
    }
  }

  /**
   * Method to set the initial date and time for the entry
   * @memberOf CreateEntryComponent
   */
  setInitialDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);

    this.entry.entryTimeOfTransaction = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Method to handle form submission
   * @param newEntryFormData The form data submitted
   * @memberOf CreateEntryComponent
   */
  onSubmit(newEntryFormData: Entry) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('authentication/login')
      return;
    }

    const date = newEntryFormData.entryTimeOfTransaction.split('T')[0];
    const time = newEntryFormData.entryTimeOfTransaction.split('T')[1];

    newEntryFormData.entryTimeOfTransaction = date + ' ' + time;

    if (newEntryFormData.entryAmount === null || newEntryFormData.entryTimeOfTransaction === '') {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.create-entry.alert_create_entry_missing_fields'), 'missing');
      return;
    }

    if (!newEntryFormData.entryAmount.toString().match(/^(-)?\d+(\.\d{0,2})?$/)) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.create-entry.alert_invalid_amount'), 'invalid');
      return;
    }

    const loggedInUser = JSON.parse(storedUser);
    if (this.subcategoryId != null) {
      this.entryService.insertEntry(loggedInUser.username, loggedInUser.password, this.subcategoryId, newEntryFormData).subscribe({
        next: () => {
          this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(this.subcategoryId)}`);
        },
        error: (err) => {
          if (err.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else if (err.status === 400) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.create-entry.alert_create_entry_missing_fields'), 'missing');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.create-entry.console_error_creating_entry'), err);
          }
        }
      });
    } else {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
      this.router.navigate([`/logged-in-homepage/categories`]);
    }
  }

  /**
   * Method to navigate back to entries
   * @memberOf CreateEntryComponent
   */
  goToEntriesPage() {
    this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(this.subcategoryId)}`);
  }
}
