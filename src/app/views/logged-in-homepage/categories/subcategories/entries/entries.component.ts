import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from "../../../../../logic/LocalStorageService";
import {UserService} from "../../../../../logic/services/UserService";
import {EntryService} from "../../../../../logic/services/EntryService";
import {Entry} from "../../../../../logic/models/Entry";

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})

export class EntriesComponent implements OnInit {
  entries: Entry[] = [];
  protected subcategoryId: number | undefined;
  private categoryId: number | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: EntryService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.subcategoryId = +params['subcategoryId'];
      });
      this.fetchEntries(this.subcategoryId);
    }
  }

  private fetchEntries(subcategoryId: number | undefined): void {
    console.log('fetching entries' + subcategoryId);
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    this.apiService.getEntriesBySubcategoryId(UserService.loggedInUser.username, UserService.loggedInUser.password, subcategoryId)
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

  addEntry() {
    this.router.navigateByUrl(`/logged-in-homepage/create-entry/${(this.categoryId)}/${(this.subcategoryId)}`);
  }

  returnToSubcategory() {
    this.router.navigateByUrl(`/logged-in-homepage/subcategories/${(this.categoryId)}`);
  }
}
