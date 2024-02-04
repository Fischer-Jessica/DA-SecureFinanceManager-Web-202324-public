import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../../../logic/services/UserService";
import {EntryService} from "../../../../../../logic/services/EntryService";
import {Entry} from "../../../../../../logic/models/Entry";
import {LocalStorageService} from "../../../../../../logic/LocalStorageService";

@Component({
  selector: 'app-create-entry',
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.css']
})
export class CreateEntryComponent {
  entry: Entry = {
    subcategoryId: 0,
    entryAmount: 0,
    entryTimeOfTransaction: ''
  };

  private categoryId: number | undefined;
  private subcategoryId: number | undefined;

  constructor(private route: ActivatedRoute,
              private localStorageService: LocalStorageService,
              private router: Router,
              private apiService: EntryService) {
  }

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.subcategoryId = +params['subcategoryId'];
      });
    }
  }

  onSubmit(formData: Entry) {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }
    console.log(formData.entryTimeOfTransaction);
    this.apiService.insertEntry(UserService.loggedInUser.username, UserService.loggedInUser.password, this.subcategoryId, formData).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(this.subcategoryId)}`);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  returnToEntries() {
    this.route.params.subscribe(params => {
      let categoryId = +params['categoryId'];
      this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(this.subcategoryId)}`);
    });
  }
}
