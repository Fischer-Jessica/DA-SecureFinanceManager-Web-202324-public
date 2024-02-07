import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Entry} from "../../../../logic/models/Entry";
import {LocalStorageService} from "../../../../logic/LocalStorageService";
import {EntryLabelService} from "../../../../logic/services/EntryLabelService";

@Component({
  selector: 'app-entries',
  templateUrl: './label-entries.component.html',
  styleUrls: ['./label-entries.component.css']
})
export class LabelEntriesComponent implements OnInit {
  entries: Entry[] = [];
  protected labelId: number | undefined;

  constructor(private route: ActivatedRoute,
              private apiService: EntryLabelService,
              private cdr: ChangeDetectorRef,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.labelId = +params['labelId'];
      });
      this.fetchEntries(loggedInUser.username, loggedInUser.password, this.labelId);
    }
  }

  private fetchEntries(username: string, password: string, labelId: number | undefined): void {
    this.apiService.getEntriesByLabelId(username, password, labelId)
      .subscribe(
        (result) => {
          this.entries = result;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching subcategories:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  removeEntry(entryId: number | undefined) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      const loggedInUser = JSON.parse(storedUser);
      this.apiService.removeLabelFromEntry(loggedInUser.username, loggedInUser.password, this.labelId, entryId)
        .subscribe(
          (result) => {
            this.cdr.detectChanges(); // Trigger change detection
            window.location.reload();
          },
          (error) => {
            console.error('Error removing label from entry:', error);
          }
        );
    } else {
      console.error('No user logged in');
    }
  }
}
