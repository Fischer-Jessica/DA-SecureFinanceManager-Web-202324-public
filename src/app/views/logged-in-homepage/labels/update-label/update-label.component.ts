import {Component, OnInit} from '@angular/core';
import {Label} from "../../../../logic/models/Label";
import {ActivatedRoute, Router} from "@angular/router";
import {LabelService} from "../../../../logic/services/LabelService";
import {LocalStorageService} from "../../../../logic/LocalStorageService";
import {UserService} from "../../../../logic/services/UserService";

@Component({
  selector: 'app-update-label',
  templateUrl: './update-label.component.html',
  styleUrls: ['./update-label.component.css']
})
export class UpdateLabelComponent implements OnInit {
  label: Label = {} as Label;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private labelService: LabelService,
              private localStorageService: LocalStorageService,
              private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.loadLabelData();
  }

  private loadLabelData(): void {
    const loggedInUser = this.localStorageService.getItem('loggedInUser');

    if (!loggedInUser) {
      console.error('User is not logged in');
      return;
    }

    this.userService.loggedInUser = JSON.parse(loggedInUser);

    this.route.params.subscribe(params => {
      const labelId = +params['labelId'];

      if (isNaN(labelId)) {
        console.error('Invalid labelId provided in the route');
        return;
      }

      this.labelService.getLabel(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        labelId
      ).subscribe(
        result => this.label = result,
        error => console.error('Error fetching label:', error)
      );
    });
  }

  onSubmit(formData: any): void {
    if (!formData.valid) {
      console.error('Invalid form data provided');
      console.log(this.label);
      return;
    }

    if (this.label.labelId != null) {
      this.labelService.updateLabel(
        this.userService.loggedInUser.username,
        this.userService.loggedInUser.password,
        this.label.labelId,
        this.label
      ).subscribe(
        result => {
          console.log('Successfully updated label:', result);
          this.router.navigate(['logged-in-homepage/labels']);
        },
        error => console.error('Error updating label:', error)
      );
    }
  }

  onColourSelected(colourId: number): void {
    this.label.labelColourId = colourId;
  }
}
