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
      });
      this.fetchEntries(this.subcategoryId, loggedInUser.username, loggedInUser.password);
      this.fetchLabels(loggedInUser.username, loggedInUser.password);
    }
  }

  fetchLabels(username: string, password: string): void {
    this.labelService.getLabels(username, password)
      .subscribe(
        (result) => {
          for (let label of result) {
            this.colourService.getColour(label.labelColourId).subscribe(
              (result) => {
                if (label.labelId != null)
                  this.availableLabels.push({
                    label: label,
                    labelId: label.labelId,
                    colourHex: result.colourCode
                  });
              },
              (error) => {
                console.error('Error fetching colour:', error);
              }
            );
          }},
        (error) => {
          console.error('Error fetching labels:', error);
          // Handle error (e.g., display an error message)
        }
      );
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
            console.error('Error fetching labels for entry:', error);
            // Handle error (e.g., display an error message)
          }
        );
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


  private fetchEntries(subcategoryId: number | undefined, username: string, password: string): void {
    this.entryService.getEntriesBySubcategoryId(username, password, subcategoryId)
      .subscribe(
        (result) => {
          this.entries = result;
          this.fetchLabelsOfEntry(username, password);
        },
        (error) => {
          console.error('Error fetching entries:', error);
          // Handle error (e.g., display an error message)
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

  getLabelColour(labelId: number | undefined) {
    return this.availableLabels.find(item => item.labelId === labelId)?.colourHex;
  }
}
