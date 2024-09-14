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
import {SubcategoryService} from "../../../../../logic/services/SubcategoryService";
import {CategoryService} from "../../../../../logic/services/CategoryService";
import {Subcategory} from "../../../../../logic/models/Subcategory";

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
   * Array containing objects representing subcategories and their associated color hex codes.
   * Each object in the array has the following structure:
   * - subcategory: The subcategory object.
   * - subcategoryColourHex: The color hex code associated with the subcategory.
   */
  subcategoriesData: {
    subcategory: Subcategory;
    subcategoryColourHex: string,
  }[] = [];

  /**
   * Constructor for EntriesComponent
   * @param {Router} router The Angular Router service
   * @param {ActivatedRoute} route The Angular ActivatedRoute service
   * @param {EntryService} entryService The service for entry operations
   * @param {LabelService} labelService The service for label operations
   * @param {EntryLabelService} entryLabelService The service for entry label operations
   * @param {CategoryService} categoryService The service for managing categories
   * @param {SubcategoryService} subcategoryService The service for managing subcategories
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
              private categoryService: CategoryService,
              private subcategoryService: SubcategoryService,
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
                  const dateA = this.parseDate(a.entryTimeOfTransaction);
                  const dateB = this.parseDate(b.entryTimeOfTransaction);

                  if (dateA === null || dateB === null) {
                    return 0;
                  }
                  return dateB.getTime() - dateA.getTime();
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
            this.fetchSubcategoriesWithoutCategoryId(username, password);
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
                if (a.labelName !== undefined && b.labelName !== undefined) {
                  return a.labelName.localeCompare(b.labelName, undefined, {numeric: true});
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
                    if (a.label.labelName !== undefined && b.label.labelName !== undefined) {
                      return a.label.labelName.localeCompare(b.label.labelName, undefined, {numeric: true});
                    }
                    return 0;
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
   * Fetches subcategories without a specified category ID.
   * Retrieves subcategories from the backend service using provided credentials.
   * Populates a data structure with subcategory information along with associated color hex codes.
   * @param {string} username - Username used for authentication.
   * @param {string} password - Password used for authentication.
   */
  fetchSubcategoriesWithoutCategoryId(username: string, password: string) {
    this.categoryService
      .getCategories(username, password)
      .subscribe(
        (result) => {
          for (let category of result) {
            if (category.categoryId != null) {
              this.subcategoryService.getSubcategories(username, password, category.categoryId)
                .subscribe(
                  (result) => {
                    for (let subcategory of result) {
                      if (subcategory.subcategoryId !== null && subcategory.subcategoryId !== undefined) {
                        this.colourService.getColourHex(subcategory.subcategoryColourId).subscribe(
                          (result) => {
                            this.subcategoriesData.push({
                              subcategory: subcategory,
                              subcategoryColourHex: result
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
                      console.info(this.translateService.instant('logged-in-homepage.categories.subcategories.alert_create_subcategory_first'));
                    } else if (error.status === 401) {
                      this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
                      this.localStorageService.removeItem('loggedInUser');
                      this.router.navigateByUrl('/authentication/login');
                    } else {
                      this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
                      console.error(this.translateService.instant('logged-in-homepage.categories.subcategories.console_error_fetching_subcategories'), error);
                    }
                  }
                );
            } else {
              this.snackBarService.showAlert(this.translateService.instant('logged-in-homepage.alert_error_path_parameter_invalid'), 'error');
              this.router.navigate([`/logged-in-homepage/categories`]);
            }
          }
          this.cdr.detectChanges();
        },
        (error) => {
          if (error.status === 404) {
            console.info(this.translateService.instant('logged-in-homepage.categories.alert_create_category_first'));
          } else if (error.status === 401) {
            this.snackBarService.showAlert(this.translateService.instant('authentication.alert_user_not_logged_in'), 'info');
            this.localStorageService.removeItem('loggedInUser');
            this.router.navigateByUrl('/authentication/login');
          } else {
            this.snackBarService.showAlert(this.translateService.instant('alert_error'), 'error');
            console.error(this.translateService.instant('logged-in-homepage.categories.console_error_fetching_categories'), error);
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
                    if (a.labelName !== undefined && b.labelName !== undefined) {
                      return a.labelName.localeCompare(b.labelName, undefined, {numeric: true});
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
   * Parses a date string into a Date object.
   * @param dateString The date string to parse.
   * @returns A Date object or null if parsing fails.
   */
  private parseDate(dateString: string): Date | null {
    const parts = dateString.split(' '); // Angenommen, das Format ist "DD.MM.YYYY HH:MM"
    if (parts.length !== 2) return null;

    const dateParts = parts[0].split('.');
    const timeParts = parts[1].split(':');

    if (dateParts.length !== 3 || timeParts.length !== 2) return null;

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Monate sind 0-indexiert
    const year = parseInt(dateParts[2], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    return new Date(year, month, day, hours, minutes);
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
   * Retrieves the subcategory object associated with the given subcategory ID from the stored subcategories data.
   * @param entrySubcategoryId The ID of the subcategory to retrieve.
   * @returns The subcategory object if found, otherwise undefined.
   */
  getSubcategoryForEntry(entrySubcategoryId: number) {
    return this.subcategoriesData.find(item => item.subcategory.subcategoryId === entrySubcategoryId)?.subcategory;
  }

  /**
   * Retrieves the color hex code associated with the given subcategory ID from the stored subcategories data.
   * @param entrySubcategoryId The ID of the subcategory to retrieve the color hex code for.
   * @returns The color hex code if found, otherwise undefined.
   */
  getSubcategoryColourHex(entrySubcategoryId: number) {
    return this.subcategoriesData.find(item => item.subcategory.subcategoryId === entrySubcategoryId)?.subcategoryColourHex;
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
