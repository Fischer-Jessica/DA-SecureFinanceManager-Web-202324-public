import {Component} from '@angular/core';
import {Category} from "../../../logic/models/Category";
import {CategoryService} from "../../../logic/services/CategoryService";
import {UserService} from "../../../logic/services/UserService";
import {Label} from "../../../logic/models/Label";
import {LabelService} from "../../../logic/services/LabelService";

@Component({
  selector: 'logged-in-labels',
  templateUrl: './logged-in-labels.component.html',
  styleUrls: ['./logged-in-labels.component.css']
})
export class LoggedInLabelsComponent {
  labels: Label[] = [];

  constructor(private apiService: LabelService) {}

  ngOnInit(): void {
    this.fetchLabels();
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
