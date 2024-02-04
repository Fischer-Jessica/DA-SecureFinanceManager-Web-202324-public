import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Entry} from "../../../../logic/models/Entry";
import {EntryService} from "../../../../logic/services/EntryService";
import {LocalStorageService} from "../../../../logic/LocalStorageService";

@Component({
  selector: 'app-entries',
  templateUrl: './label-entries.component.html',
  styleUrls: ['./label-entries.component.css']
})
export class LabelEntriesComponent implements OnInit {
  entries: Entry[] = [];
  protected labelId: number | undefined;

  constructor(private route: ActivatedRoute,
              private apiService: EntryService,
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
        },
        (error) => {
          console.error('Error fetching subcategories:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }
}
