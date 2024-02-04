import {Component} from '@angular/core';
import {Label} from '../../../../logic/models/Label';
import {LabelService} from '../../../../logic/services/LabelService';
import {Router} from '@angular/router';
import {LocalStorageService} from '../../../../logic/LocalStorageService';

@Component({
  selector: 'app-create-new-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.css']
})
export class CreateLabelComponent {
  label: Label = {
    labelName: '',
    labelColourId: 0,
  };

  constructor(private labelService: LabelService,
              private router: Router,
              private localStorageService: LocalStorageService) {
  }

  onColourSelected(colourId: number): void {
    this.label.labelColourId = colourId;
  }

  onSubmit(formData: Label) {
    formData.labelColourId = this.label.labelColourId;
    const storedUser = this.localStorageService.getItem('loggedInUser');

    if (!storedUser) {
      console.error('User is not logged in');
      return;
    }

    const loggedInUser = JSON.parse(storedUser);

    // Hier die Anpassungen für den Label-Service vornehmen
    this.labelService.insertLabel(loggedInUser.username, loggedInUser.password, formData)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/logged-in-homepage/labels');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  // Weitere Methoden wie returnToLabels können hier hinzugefügt werden
}
