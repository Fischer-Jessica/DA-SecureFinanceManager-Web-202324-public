import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../../../../logic/services/UserService";
import {LocalStorageService} from "../../../../../../logic/LocalStorageService";
import {EntryService} from "../../../../../../logic/services/EntryService";
import {ActivatedRoute, Router} from "@angular/router";
import {Entry} from "../../../../../../logic/models/Entry";

@Component({
  selector: 'app-update-entry',
  templateUrl: './update-entry.component.html',
  styleUrls: ['./update-entry.component.css']
})
export class UpdateEntryComponent implements OnInit {
  entry: Entry = {} as Entry;
  subcategoryId: number | undefined = 0;
  categoryId: number | undefined = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entryService: EntryService,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.loadEntry();
  }

  private loadEntry() {
    const loggedInUser = this.localStorageService.getItem('loggedInUser');

    if (!loggedInUser) {
      console.error('User is not logged in');
      return;
    }

    this.userService.loggedInUser = JSON.parse(loggedInUser);

    this.route.params.subscribe(params => {
      this.categoryId = +params['categoryId'];
      this.subcategoryId = +params['subcategoryId'];
      const entryId = +params['entryId'];

      if (isNaN(this.subcategoryId)) {
        console.error('Invalid categoryId provided in the route');
        return;
      }

      this.entryService.getEntry(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        this.subcategoryId,
        entryId
      ).subscribe(
        result => {
          this.entry = result
        },
        error => console.error('Error fetching category:', error)
      );
    });
  }

  onSubmit(formData: any) {
    if (!formData.valid) {
      console.error('Invalid form data provided');
      return;
    }

    if (this.entry.entryId != null) {
      this.entryService.updateEntry(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        this.subcategoryId,
        this.entry
      ).subscribe(
        result => this.router.navigate([`/logged-in-homepage/entries/${this.categoryId}/${this.subcategoryId}`]),
        error => console.error('Error updating entry:', error)
      );
    }
  }

  onCancel(): void {
    this.router.navigate([`/logged-in-homepage/entries/${this.categoryId}/${this.subcategoryId}`]);
  }
}
