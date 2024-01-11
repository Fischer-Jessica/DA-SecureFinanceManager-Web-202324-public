import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../logic/services/UserService";
import {Label} from "../../../logic/models/Label";
import {LabelService} from "../../../logic/services/LabelService";
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";
import {Subcategory} from "../../../logic/models/Subcategory";
import {ColourService} from "../../../logic/services/ColourService";

@Component({
  selector: 'logged-in-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  labelsData: { label: Label; colourName: string }[] = [];

  constructor(private router: Router, private apiService: LabelService, private localStorageService: LocalStorageService, private colourService: ColourService) {
  }

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
          for (let label of result) {
            this.colourService.getColourName(label.labelColourId).subscribe(
              (result) => {
                this.labelsData.push({
                  label: label,
                  colourName: result
                });
              },
              (error) => {
                console.error('Error fetching colour:', error);
                // Handle error (e.g., display an error message)
              }
            );
          }
        },
        (error) => {
          console.error('Error fetching labels:', error);
          // Handle error (e.g., display an error message)
        }
      );
  }

  showEntries(labelId: number | undefined) {
    console.log(labelId)
    this.router.navigateByUrl(`/logged-in-homepage/labels/${labelId}/entries`);
  }
}
