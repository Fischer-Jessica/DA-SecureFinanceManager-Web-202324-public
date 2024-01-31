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
        this.user = UserService.loggedInUser;
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

    if (UserService.loggedInUser == null) {
      console.error('User is not logged in');
      return;
    }

    this.userService.updateUser(
      UserService.loggedInUser.username,
      UserService.loggedInUser.password,
      this.user
    ).subscribe(
      result => {
      },
      error => console.error('Error updating user:', error)
    );
  }
}
