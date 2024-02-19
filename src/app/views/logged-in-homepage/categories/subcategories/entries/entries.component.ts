import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {EntryService} from "../../../../../logic/services/EntryService";
import {Entry} from "../../../../../logic/models/Entry";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LabelService} from "../../../../../logic/services/LabelService";
import {EntryLabelService} from "../../../../../logic/services/EntryLabelService";
import {Label} from "../../../../../logic/models/Label";
import {ColourService} from "../../../../../logic/services/ColourService";

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})

export class EntriesComponent implements OnInit {
  entries: Entry[] = [];
  protected subcategoryId: number | undefined;
  protected categoryId: number | undefined;
  protected availableLabels: { label: Label; labelId: number; colourHex: string }[] = [];
  protected selectedLabelForEntries: Map<number, Label[]> = new Map<number, Label[]>();
  dropdownOpen: { [entryId: string]: boolean } = {}; // Objekt zur Verfolgung des Dropdown-Status für jeden Eintrag
  protected labelId: number | undefined = undefined;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private entryService: EntryService,
              private labelService: LabelService,
              private entryLabelService: EntryLabelService,
              private colourService: ColourService,
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
        this.labelId = isNaN(+params['labelId']) ? undefined : +params['labelId'];
        console.log('labelId: ' + this.labelId);
        console.log('subcategoryId: ' + this.subcategoryId);
        console.log('categoryId: ' + this.categoryId);
      });
      this.fetchEntries(this.subcategoryId, loggedInUser.username, loggedInUser.password);
      this.fetchLabels(loggedInUser.username, loggedInUser.password);
    }
  }

  fetchLabels(username: string, password: string): void {
    this.labelService.getLabels(username, password)
      .subscribe(
        (result) => {
          this.availableLabels = []; // Clear existing data
          for (let label of result) {
            const labelId = label.labelId ?? 0; // Set labelId to 0 if it's undefined
            if (labelId !== 0) { // Check if labelId is not 0
              this.colourService.getColour(label.labelColourId).subscribe(
                (result) => {
                  this.availableLabels.push({
                    label: label,
                    labelId: labelId, // Use labelId here
                    colourHex: result.colourCode
                  });
                  // Sort availableLabels after each new entry
                  this.availableLabels.sort((a, b) => {
                    return a.labelId - b.labelId;
                  });
                },
                (error) => {
                  console.error('Error fetching colour:', error);
                }
              );
            }
          }
        },
        (error) => {
          console.error('Error fetching labels:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  fetchLabelsOfEntry(username: string, password: string): void {
    for (const entry of this.entries) {
      if (entry.entryId !== null && entry.entryId !== undefined) { // Check if entryId is not null or undefined
        this.entryLabelService.getLabelsByEntryId(username, password, entry.entryId)
          .subscribe(
            (result) => {
              // Sort labels after receiving them
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
              console.error('Error fetching labels for entry:', error);
              // Handle error (e.g., display an error message)
            }
          );
      }
    }
  }


  toggleDropdown(entryId: number | undefined) {
    if (entryId) {
      if (!this.dropdownOpen.hasOwnProperty(entryId)) {
        this.dropdownOpen[entryId] = false;
      }
      this.dropdownOpen[entryId] = !this.dropdownOpen[entryId];
    }
  }

  isLabelSelected(entryId: number | undefined, labelId: number): boolean {
    if (entryId) {
      const labelsForEntry = this.selectedLabelForEntries.get(entryId);
      if (labelsForEntry) {
        return labelsForEntry.some(label => label.labelId === labelId);
      }
    }
      return false;
  }


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

  addLabelToEntry(entryId: number, labelId: number) {
    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);

      this.entryLabelService.addLabelToEntry(loggedInUser.username, loggedInUser.password, entryId, labelId)
        .subscribe(
          (result) => {
            this.cdr.detectChanges(); // Trigger change detection



            if (this.selectedLabelForEntries.has(entryId)) {
              const labelList = this.selectedLabelForEntries.get(entryId);
              if (labelList) {
                const availableLabel = this.availableLabels.find(availableLabel => availableLabel.labelId === labelId);
                if (availableLabel) {
                  labelList.push(availableLabel.label);
                }
              }
            } else {
              const availableLabel = this.availableLabels.find(availableLabel => availableLabel.labelId === labelId);
              if (availableLabel) {
                this.selectedLabelForEntries.set(entryId, [availableLabel.label]);
              }
            }



          },
          (error) => {
            console.error('Error adding label to entry:', error);
          }
        );
    } else {
      console.error('No user logged in');
    }
  }


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
            this.cdr.detectChanges(); // Trigger change detection
          },
          (error) => {
            console.error('Error removing label from entry:', error);
            // Zurücksetzen von this.selectedLabelForEntries auf den vorherigen Stand im Fehlerfall
            this.selectedLabelForEntries.set(entryId, labelsForEntry);
            // Handle error (e.g., display an error message)
          }
        );
    } else {
      console.error('No user logged in');
    }
  }

  // TODO: Sortieren der Entries nach entryTimeOfTransaction, sodass der aktuellste Eintrag immer oben ist.
  private fetchEntries(subcategoryId: number | undefined, username: string, password: string): void {
    if (this.labelId == undefined) {
      this.entryService.getEntriesBySubcategoryId(username, password, subcategoryId)
        .subscribe(
          (result) => {
            this.entries = result;
            // Sort entries after receiving them
            this.entries.sort((a, b) => {
              if (a.entryId !== undefined && b.entryId !== undefined) {
                return a.entryId - b.entryId;
              }
              return 0;
            });
            this.fetchLabelsOfEntry(username, password);
          },
          (error) => {
            console.error('Error fetching entries:', error);
            // Handle error (e.g., display an error message)
          }
        );
    } else {
      this.entryLabelService.getEntriesByLabelId(username, password, this.labelId)
        .subscribe(
          (result) => {
            this.entries = result;
            // Sort entries after receiving them
            this.entries.sort((a, b) => {
              if (a.entryId !== undefined && b.entryId !== undefined) {
                return a.entryId - b.entryId;
              }
              return 0;
            });
            this.fetchLabelsOfEntry(username, password);
          },
          (error) => {
            console.error('Error fetching entries:', error);
            // Handle error (e.g., display an error message)
          }
        );
    }
  }

  // TODO: Den User fragen, ob er wirklich löschen möchte
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

  getLabelColour(labelId: number | undefined) {
    return this.availableLabels.find(item => item.labelId === labelId)?.colourHex;
  }
}
