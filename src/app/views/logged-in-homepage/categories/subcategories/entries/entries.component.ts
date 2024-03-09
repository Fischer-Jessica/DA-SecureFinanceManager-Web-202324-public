import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../../../../../logic/services/LocalStorageService";
import {EntryService} from "../../../../../logic/services/EntryService";
import {Entry} from "../../../../../logic/models/Entry";
import {LabelService} from "../../../../../logic/services/LabelService";
import {EntryLabelService} from "../../../../../logic/services/EntryLabelService";
import {Label} from "../../../../../logic/models/Label";
import {ColourService} from "../../../../../logic/services/ColourService";
import {TranslateService} from "@ngx-translate/core";
import {SnackBarService} from "../../../../../logic/services/SnackBarService";

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css', '../../../logged-in-homepage.component.css']
})

/**
 * Component for managing entries
 * @class EntriesComponent
 * @implements {OnInit}
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class EntriesComponent implements OnInit {
  /**
   * Array to store entry data
   * @type {Entry[]}
   */
  entries: Entry[] = [];

  /**
   * ID of the subcategory
   * @type {(number | undefined)}
   */
  protected subcategoryId: number | undefined;

  /**
   * ID of the category
   * @type {(number | undefined)}
   */
  protected categoryId: number | undefined;

  /**
   * Array to store available labels along with their IDs and colours
   * @type {{ label: Label; labelId: number; colourHex: string }[]}
   */
  protected availableLabels: { label: Label; labelId: number; colourHex: string }[] = [];

  /**
   * Map to store selected labels for entries
   * @type {Map<number, Label[]>}
   */
  protected selectedLabelForEntries: Map<number, Label[]> = new Map<number, Label[]>();

  /**
   * Object to track the dropdown status for each entry
   * @type {{[p: string]: boolean}}
   */
  dropdownOpen: { [entryId: string]: boolean } = {};

  /**
   * ID of the selected label
   * @type {(number | undefined)}
   */
  protected labelId: number | undefined = undefined;

  /**
   * Constructor for EntriesComponent
   * @param {Router} router The Angular Router service
   * @param {ActivatedRoute} route The Angular ActivatedRoute service
   * @param {EntryService} entryService The service for entry operations
   * @param {LabelService} labelService The service for label operations
   * @param {EntryLabelService} entryLabelService The service for entry label operations
   * @param {ColourService} colourService The service for managing colours
   * @param {LocalStorageService} localStorageService The service for managing local storage
   * @param {TranslateService} translateService The service for translation
   * @param {SnackBarService} snackBarService The service for displaying snack bar messages
   * @param {ChangeDetectorRef} cdr The Angular ChangeDetectorRef service
   * @memberOf EntriesComponent
   */
  constructor(private router: Router,
              private route: ActivatedRoute,
              private entryService: EntryService,
              private labelService: LabelService,
              private entryLabelService: EntryLabelService,
              private colourService: ColourService,
              private localStorageService: LocalStorageService,
              private translateService: TranslateService,
              private snackBarService: SnackBarService,
              private cdr: ChangeDetectorRef) {
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * @memberOf EntriesComponent
   * @memberOf EntriesComponent
   */
  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.subcategoryId = +params['subcategoryId'];
        this.labelId = isNaN(+params['labelId']) ? undefined : +params['labelId'];

        if ((this.categoryId === undefined || this.subcategoryId === undefined) && this.labelId === undefined) {
          this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
          this.router.navigateByUrl('/logged-in-homepage/categories');
          return;
        }
      });
      this.fetchEntriesBySubcategoryOrLabel(this.subcategoryId, loggedInUser.username, loggedInUser.password);
      this.fetchAvailableLabels(loggedInUser.username, loggedInUser.password);
    } else {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
  }

  /**
   * Method to fetch entries
   * @param {number | undefined} subcategoryId The ID of the subcategory
   * @param {string} username The username for authentication
   * @param {string} password The password for authentication
   * @memberOf EntriesComponent
   */
  private fetchEntriesBySubcategoryOrLabel(subcategoryId: number | undefined, username: string, password: string): void {
    if (this.labelId === undefined) {
      if (subcategoryId != null) {
        this.entryService.getEntries(username, password, subcategoryId)
          .subscribe(
            (result) => {
              const sortedEntries = [...result];
              sortedEntries.sort((a, b) => {
                if (a.entryTimeOfTransaction && b.entryTimeOfTransaction) {
                  return new Date(b.entryTimeOfTransaction).getTime() - new Date(a.entryTimeOfTransaction).getTime();
                }
                return 0;
              });
              this.entries = sortedEntries;

              this.entries.forEach(entry => {
                if (entry.entryCreationTime) {
                  entry.entryCreationTime = this.formatTheEntryCreationTime(new Date(entry.entryCreationTime));
                } else {
                  entry.entryCreationTime = 'N/A';
                }
              });
              this.fetchLabelsOfEntry(username, password);
            },
            (error) => {
              if (error.status === 401) {
                this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
                this.localStorageService.removeItem('loggedInUser');
                this.router.navigateByUrl('/authentication/login');
              } else if (error.status === 400) {
                this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.alert_parameter_subcategoryId_invalid'), 'error');
              } else if (error.status === 404) {
                this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.alert_no_entries_found'), 'info');
              } else {
                this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
                console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.console_error_fetching_entries'), error);
              }
            }
          );
      } else {
        this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
        this.router.navigateByUrl('/logged-in-homepage/categories');
      }
    } else {
      this.entryLabelService.getEntriesByLabelId(username, password, this.labelId)
        .subscribe(
          (result) => {
            const sortedEntries = [...result];
            sortedEntries.sort((a, b) => {
              if (a.entryTimeOfTransaction && b.entryTimeOfTransaction) {
                return new Date(b.entryTimeOfTransaction).getTime() - new Date(a.entryTimeOfTransaction).getTime();
              }
              return 0;
            });
            this.entries = sortedEntries;
            this.fetchLabelsOfEntry(username, password);
          },
          (error) => {
            if (error.status === 401) {
              this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
              this.localStorageService.removeItem('loggedInUser');
              this.router.navigateByUrl('/authentication/login');
            } else if (error.status === 400) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.label-entries.alert_parameter_labelId_invalid'), 'error');
            } else if (error.status === 404) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.label-entries.alert_no_entries_for_label'), 'info');
            } else {
              this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
              console.error(this.translateService.instant('logged-in-homepage.labels.label-entries.console_error_fetching_entries_for_label'), error);
            }
          }
        );
    }
  }

  /**
   * Formats a given date into a string representation with the format "DD.MM.YYYY HH:MM".
   * @param date The date to be formatted.
   * @returns A string representing the formatted date and time.
   */
  formatTheEntryCreationTime(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  /**
   * Method to fetch labels of an entry
   * @param {string} username The username for authentication
   * @param {string} password The password for authentication
   * @memberOf EntriesComponent
   */
  fetchLabelsOfEntry(username: string, password: string): void {
    for (const entry of this.entries) {
      if (entry.entryId !== null && entry.entryId !== undefined) {
        this.entryLabelService.getLabelsByEntryId(username, password, entry.entryId)
          .subscribe(
            (result) => {
              result.sort((a, b) => {
                if (a.labelId !== undefined && b.labelId !== undefined) {
                  return a.labelId - b.labelId;
                }
                return 0;
              });
              if (entry.entryId != null) {
                this.selectedLabelForEntries.set(entry.entryId, result);
              }
            },
            (error) => {
              if (error.status === 404) {
                console.info(this.translateService.instant('logged-in-homepage.labels.label-entries.console_no_labels_for_entry_found') + entry.entryId);
              } else if (error.status === 401) {
                this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
                this.localStorageService.removeItem('loggedInUser');
                this.router.navigateByUrl('/authentication/login');
              } else if (error.status === 400) {
                this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.label-entries.alert_parameter_entryId_invalid'), 'error');
              } else {
                this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
                console.error(this.translateService.instant('logged-in-homepage.labels.label-entries.console_error_fetching_label_for_entry') + entry.entryId, error);
              }
            }
          );
      }
    }
  }

  /**
   * Method to fetch labels
   * @param {string} username The username for authentication
   * @param {string} password The password for authentication
   * @memberOf EntriesComponent
   */
  fetchAvailableLabels(username: string, password: string): void {
    this.labelService.getLabels(username, password)
      .subscribe(
        (result) => {
          this.availableLabels = [];
          for (let label of result) {
            const labelId = label.labelId ?? 0;
            if (labelId !== 0) {
              this.colourService.getColour(label.labelColourId).subscribe(
                (result) => {
                  this.availableLabels.push({
                    label: label,
                    labelId: labelId,
                    colourHex: result.colourCode
                  });
                  this.availableLabels.sort((a, b) => {
                    return a.labelId - b.labelId;
                  });
                },
                (error) => {
                  if (error.status === 404) {
                    this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.colours.alert_colours_not_found'), 'error');
                  } else {
                    this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
                    console.error(this.translateService.instant('logged-in-homepage.colours.console_error_fetching_colours'), error);
                  }
                }
              );
            }
          }
        },
        (error) => {
          if (error.status === 404) {
            this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.alert_create_label_first'), 'info');
          } else if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.labels.console_error_fetching_labels'), error);
          }
        }
      );
  }

  /**
   * Method to delete an entry
   * @param {number | undefined} entryId The ID of the entry
   * @memberOf EntriesComponent
   */
  deleteEntry(entryId: number | undefined) {
    const confirmDelete = confirm(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.confirm_delete_entry'));
    if (!confirmDelete) {
      return;
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
    const loggedInUser = JSON.parse(storedUser);
    if (this.subcategoryId != null && entryId != null) {
      this.entryService.deleteEntry(loggedInUser.username, loggedInUser.password, this.subcategoryId, entryId)
        .subscribe(
          (result) => {
            this.entries = this.entries.filter((item) => item.entryId !== entryId);
            this.cdr.detectChanges();
          },
          (error) => {
            if (error.status === 401) {
              this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
              this.localStorageService.removeItem('loggedInUser');
              this.router.navigateByUrl('/authentication/login');
            } else if (error.status === 400) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.alert_parameter_entryId_invalid'), 'error');
            } else if (error.status === 404) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.alert_entry_not_found'), 'error');
            } else {
              this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
              console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.entries.console_error_deleting_entry'), error);
            }
          }
        );
    } else {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
      this.router.navigateByUrl('/logged-in-homepage/categories');
      return;
    }
  }

  /**
   * Method to toggle dropdown for an entry
   * @param {number | undefined} entryId The ID of the entry
   * @memberOf EntriesComponent
   */
  toggleDropdown(entryId: number | undefined) {
    if (this.availableLabels.length <= 0 || !this.availableLabels) {
      this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.alert_create_label_first'), 'info');
      return;
    }
    if (entryId) {
      if (!this.dropdownOpen.hasOwnProperty(entryId)) {
        this.dropdownOpen[entryId] = false;
      }
      this.dropdownOpen[entryId] = !this.dropdownOpen[entryId];
    }
  }

  /**
   * Method to check if a label is selected for an entry
   * @param {number | undefined} entryId The ID of the entry
   * @param {number} labelId The ID of the label
   * @returns {boolean} True if the label is selected, false otherwise
   * @memberOf EntriesComponent
   */
  isLabelSelected(entryId: number | undefined, labelId: number): boolean {
    if (entryId) {
      const labelsForEntry = this.selectedLabelForEntries.get(entryId);
      if (labelsForEntry) {
        return labelsForEntry.some(label => label.labelId === labelId);
      }
    }
    return false;
  }

  /**
   * Method to toggle label selection for an entry
   * @param {number | undefined} entryId The ID of the entry
   * @param {*} label The label to toggle
   * @memberOf EntriesComponent
   */
  toggleLabel(entryId: number | undefined, label: any) {
    if (entryId) {
      const labelsForEntry = this.selectedLabelForEntries.get(entryId) || [];

      const index = labelsForEntry.findIndex((l: any) => l.labelId === label.labelId);

      if (index !== -1) {
        const updatedLabels = [...labelsForEntry.slice(0, index), ...labelsForEntry.slice(index + 1)];
        this.removeLabelFromEntry(entryId, label.labelId);

      } else {
        const updatedLabels = [...labelsForEntry, label];
        this.addLabelToEntry(entryId, label.labelId);
      }
    }
  }

  /**
   * Method to add a label to an entry
   * @param {number} entryId The ID of the entry
   * @param {number} labelId The ID of the label
   * @memberOf EntriesComponent
   */
  addLabelToEntry(entryId: number, labelId: number) {
    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);

      this.entryLabelService.addLabelToEntry(loggedInUser.username, loggedInUser.password, entryId, labelId)
        .subscribe(
          (result) => {
            this.cdr.detectChanges();
            const addedLabel = this.availableLabels.find(availableLabel => availableLabel.labelId === labelId);

            if (addedLabel) {
              if (this.selectedLabelForEntries.has(entryId)) {
                const labelList = this.selectedLabelForEntries.get(entryId);
                if (labelList) {
                  labelList.push(addedLabel.label);
                  labelList.sort((a, b) => {
                    if (a.labelId && b.labelId) {
                      return a.labelId - b.labelId;
                    }
                    return 0;
                  });
                }
              } else {
                this.selectedLabelForEntries.set(entryId, [addedLabel.label]);
              }
            }
          },
          (error) => {
            if (error.status === 401) {
              this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
              this.localStorageService.removeItem('loggedInUser');
              this.router.navigateByUrl('/authentication/login');
            } else if (error.status === 400) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.label-entries.alert_parameter_entryId_labelId_invalid'), 'error');
            } else if (error.status === 404) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.label-entries.alert_could_not_find_entry_label'), 'error');
            } else {
              this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
              console.error(this.translateService.instant('logged-in-homepage.labels.label-entries.console_error_adding_label_to_entry'), error);
            }
          }
        );
    } else {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
  }

  /**
   * Method to remove a label from an entry
   * @param {number} entryId The ID of the entry
   * @param {number} labelId The ID of the label
   * @memberOf EntriesComponent
   */
  removeLabelFromEntry(entryId: number, labelId: number) {
    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);

      const labelsForEntry = this.selectedLabelForEntries.get(entryId) || [];
      const updatedLabels = labelsForEntry.filter(label => label.labelId !== labelId);

      this.selectedLabelForEntries.set(entryId, updatedLabels);

      this.entryLabelService.removeLabelFromEntry(loggedInUser.username, loggedInUser.password, labelId, entryId)
        .subscribe(
          (result) => {
            this.cdr.detectChanges();
          },
          (error) => {
            if (error.status === 401) {
              this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
              this.localStorageService.removeItem('loggedInUser');
              this.router.navigateByUrl('/authentication/login');
            } else if (error.status === 400) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.label-entries.alert_parameter_entryId_labelId_invalid'), 'error');
            } else if (error.status === 404) {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.labels.label-entries.alert_could_not_find_entry_label'), 'error');
            } else {
              this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
              console.error(this.translateService.instant('logged-in-homepage.labels.label-entries.console_error_removing_label_from_entry'), error);
            }
            this.selectedLabelForEntries.set(entryId, labelsForEntry);
          }
        );
    } else {
      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
      this.router.navigateByUrl('/authentication/login');
      return;
    }
  }

  /**
   * Method to get the colour of a label
   * @param {number | undefined} labelId The ID of the label
   * @returns {string | undefined} The colour of the label
   * @memberOf EntriesComponent
   */
  getLabelHexOfLabel(labelId: number | undefined) {
    return this.availableLabels.find(item => item.labelId === labelId)?.colourHex;
  }

  /**
   * Method to get labels for an entry
   * @param {number | undefined} entryId The ID of the entry
   * @returns {Label[] | undefined} The labels for the entry
   * @memberOf EntriesComponent
   */
  getLabelsForEntry(entryId: number | undefined) {
    return this.selectedLabelForEntries.get(typeof entryId === "number" ? entryId : -1);
  }

  /**
   * Method to return to the subcategory page
   * @memberOf EntriesComponent
   */
  goToSubcategoriesPage() {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${(this.categoryId)}`);
  }

  /**
   * Method to navigate to the page for adding a new entry
   * @memberOf EntriesComponent
   */
  goToCreateEntryPage() {
    this.router.navigateByUrl(`/logged-in-homepage/create-entry/${(this.categoryId)}/${(this.subcategoryId)}`);
  }

  /**
   * Method to update an entry
   * @param {number | undefined} entryId The ID of the entry
   * @memberOf EntriesComponent
   */
  goToUpdateEntryPage(entryId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/update-entry/${(this.categoryId)}/${(this.subcategoryId)}/${entryId}`);
  }

  /**
   * Navigates to the entries page associated with a specific label.
   * @param labelId The ID of the label for which to navigate to the entries page.
   * @memberOf EntriesComponent
   */
  goToLabelEntriesPage(labelId: number | undefined) {
    this.router.navigateByUrl(`/logged-in-homepage/labels/${labelId}/entries`);
  }
}
