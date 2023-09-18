import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'logged-in-homepage-navbar',
  templateUrl: './logged-in-homepage-navbar.component.html',
  styleUrls: ['./logged-in-homepage-navbar.component.css']
})
export class LoggedInHomepageNavbarComponent {
  constructor(private router: Router) {
  }

  goToOverview() {
    this.router.navigateByUrl('/logged-in-homepage/logged-in-overview');
  }

  goToCategories() {
    this.router.navigateByUrl('/logged-in-homepage/logged-in-categories');
  }

  goToLabels() {
    this.router.navigateByUrl('/logged-in-homepage/logged-in-labels');
  }

  goToDiagrams() {
    this.router.navigateByUrl('/logged-in-homepage/logged-in-diagrams');
  }
}
