import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {LocalStorageService} from "../../../logic/services/LocalStorageService";

@Component({
  selector: 'logged-in-homepage-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

/**
 * Component for the navigation bar in the logged-in homepage.
 * Responsible for displaying navigation links and highlighting the active link.
 * @class NavbarComponent
 * @author Fischer
 * @fullName Fischer, Jessica Christina
 */
export class NavbarComponent {
  /**
   * Creates an instance of NavbarComponent.
   * @param {Router} router - The Router service for navigation.
   * @param {LocalStorageService} localStorageService - The LocalStorageService for storing user data.
   */
  constructor(private router: Router,
              private localStorageService: LocalStorageService) {
  }

  /**
   * Checks if the current route matches the given route.
   * @param route - The route to check against.
   * @returns {boolean} - True if the current route matches the given route, false otherwise.
   */
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  /**
   * Logs out the user by removing user data from local storage and navigating to the login page.
   * @memberof UserComponent
   */
  logout() {
    this.localStorageService.removeItem('loggedInUser');
    this.router.navigate(['/authentication/login']);
  }
}
