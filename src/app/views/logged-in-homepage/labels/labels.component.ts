import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../logic/services/UserService";
import {Label} from "../../../logic/models/Label";
import {LabelService} from "../../../logic/services/LabelService";
import {LocalStorageService} from "../../../logic/LocalStorageService";

@Component({
  selector: 'logged-in-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  labels: Label[] = [];

  constructor(private apiService: LabelService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
      this.fetchLabels();
    }
  }

  private fetchLabels(): void {
    if (UserService.loggedInUser == null) {
      return;
    }
    this.apiService.getLabels(UserService.loggedInUser.username, UserService.loggedInUser.password)
      .subscribe(
        (result) => {
          this.labels = result;
        },
        (error) => {
          console.error('Error fetching labels:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }
}
