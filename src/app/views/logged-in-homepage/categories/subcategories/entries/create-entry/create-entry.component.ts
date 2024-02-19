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

  // TODO: entryTimeOfTransaction sollte beim Aufruf des Formulars auf das aktuelle Datum und die aktuelle Uhrzeit gesetzt werden

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
    }
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
