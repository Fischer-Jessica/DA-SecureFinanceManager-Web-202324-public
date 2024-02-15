import {Component, OnInit} from '@angular/core';
import {User} from "../../../logic/models/User";
import {UserService} from "../../../logic/services/UserService";
import {LocalStorageService} from "../../../logic/LocalStorageService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(private userService: UserService,
              private router: Router,
              private localStorageService: LocalStorageService) {
  }

  protected user: User = {} as User;
  protected originalUser: User = {} as User;

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.originalUser = {...this.user}; // Kopie des ursprünglichen Benutzers erstellen
    } else {
      console.error('User is not logged in');
    }
  }

  onSubmit(formData: any): void {
    if (!formData.valid) {
      console.error('Invalid form data provided');
      return;
    }

    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      console.error('User is not logged in');
      return;
    }

    const loggedInUser: User = JSON.parse(storedUser);
    this.userService.updateUser(
      loggedInUser.username,
      loggedInUser.password,
      this.user
    ).subscribe(
      updatedUser => {
        updatedUser.password = this.user.password;
        this.localStorageService.setItem('loggedInUser', JSON.stringify(updatedUser));
      },
      error => console.error('Error updating user:', error)
    );
  }

  deleteUser() {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (!storedUser) {
      console.error('User is not logged in');
      return;
    }

    const loggedInUser: User = JSON.parse(storedUser);
    this.userService.deleteUser(
      loggedInUser.username,
      loggedInUser.password
    ).subscribe(
      () => {
        this.localStorageService.removeItem('loggedInUser');
        this.router.navigate(['/']);
      },
      error => console.error('Error deleting user:', error)
    );
  }
}
