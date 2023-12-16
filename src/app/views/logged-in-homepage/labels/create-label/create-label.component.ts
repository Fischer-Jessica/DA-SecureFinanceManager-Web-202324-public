import { Component } from '@angular/core';
import { Label } from '../../../../logic/models/Label'; // Stelle sicher, dass der Pfad korrekt ist
import { LabelService } from '../../../../logic/services/LabelService'; // Annahme: Du hast einen entsprechenden Service
import { Router } from '@angular/router';
import { UserService } from '../../../../logic/services/UserService';

@Component({
  selector: 'app-create-new-label',
  templateUrl: './create-label.component.html',
  styleUrls: ['./create-label.component.css']
})
export class CreateLabelComponent {
  label: Label = {
    labelName: '',
    labelColourId: 0,
    // userId: 0, // Falls du den userId initialisieren möchtest
  };

  constructor(private labelService: LabelService, private router: Router) {
  }

  onSubmit(formData: Label) {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }

    // Hier die Anpassungen für den Label-Service vornehmen
    this.labelService.insertLabel(UserService.loggedInUser.username, UserService.loggedInUser.password, formData)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigateByUrl('/logged-in-homepage/labels');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  // Weitere Methoden wie returnToLabels können hier hinzugefügt werden
}
