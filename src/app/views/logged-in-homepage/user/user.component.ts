import {Component, OnInit} from '@angular/core';
import {User} from "../../../logic/models/User";
import {UserService} from "../../../logic/services/UserService";
import {LocalStorageService} from "../../../logic/LocalStorageService";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  constructor(private userService: UserService, private localStorageService: LocalStorageService) {
  }

  protected user: User = {} as User;
  protected originalUser: User = {} as User;

  ngOnInit(): void {
    const storedUser = this.localStorageService.getItem('loggedInUser');
    if (storedUser) {
      UserService.loggedInUser = JSON.parse(storedUser);
    }
    this.fetchUser();
  }

  fetchUser(): void {
    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }

    this.userService.logIn(UserService.loggedInUser.username, UserService.loggedInUser.password).subscribe(
      (result) => {
        UserService.loggedInUser = result;
        localStorage.setItem('loggedInUser', JSON.stringify(result));
        this.user = {...result}; // Kopie des Benutzers erstellen
        this.originalUser = {...result}; // Kopie des ursprünglichen Benutzers erstellen
      },
      (error) => {
        console.error('Error fetching user:', error);
      });
  }

  onSubmit(formData: any): void {
    if (!formData.valid) {
      console.error('Invalid form data provided');
      return;
    }

    if (!UserService.loggedInUser) {
      console.error('User is not logged in');
      return;
    }

    console.log(UserService.loggedInUser.username + "   " + UserService.loggedInUser.password);

    this.userService.updateUser(
      UserService.loggedInUser.username,
      UserService.loggedInUser.password,
      this.user
    ).subscribe(
      updatedUser => {
        console.log('User successfully updated:', updatedUser);

        // Aktualisiere die loggedInUser-Daten im Local Storage
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

        // Aktualisiere die loggedInUser-Daten im UserService
        UserService.loggedInUser = updatedUser;
      },
      error => console.error('Error updating user:', error)
    );
  }
}
