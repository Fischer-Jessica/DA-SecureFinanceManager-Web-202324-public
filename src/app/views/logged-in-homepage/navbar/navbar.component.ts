import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'logged-in-homepage-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
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
