import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EntryService} from "../../../../../../logic/services/EntryService";
import {Entry} from "../../../../../../logic/models/Entry";
import {LocalStorageService} from "../../../../../../logic/LocalStorageService";

@Component({
  selector: 'app-create-entry',
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.css']
})
export class CreateEntryComponent implements OnInit {
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
      const loggedInUser = JSON.parse(storedUser);
      this.route.params.subscribe(params => {
        this.categoryId = +params['categoryId'];
        this.subcategoryId = +params['subcategoryId'];
      });
      this.setInitialDateTime();
    }
  }

  setInitialDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);
    const hours = ('0' + currentDate.getHours()).slice(-2);
    const minutes = ('0' + currentDate.getMinutes()).slice(-2);
    const seconds = ('0' + currentDate.getSeconds()).slice(-2);

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    this.entry.entryTimeOfTransaction = formattedDateTime;
  }

  onSubmit(formData: Entry) {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      console.error('User is not logged in');
      return;
    }

    const date = formData.entryTimeOfTransaction.split('T')[0];
    const time = formData.entryTimeOfTransaction.split('T')[1];

    const formattedDateTime = date + ' ' + time;

    formData.entryTimeOfTransaction = formattedDateTime;

    const loggedInUser = JSON.parse(storedUser);
    this.apiService.insertEntry(loggedInUser.username, loggedInUser.password, this.subcategoryId, formData).subscribe({
      next: (response) => {
        this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(this.subcategoryId)}`);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  returnToEntries() {
    this.router.navigateByUrl(`/logged-in-homepage/entries/${(this.categoryId)}/${(this.subcategoryId)}`);
  }
}
