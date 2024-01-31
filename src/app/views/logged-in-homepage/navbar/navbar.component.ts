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

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
