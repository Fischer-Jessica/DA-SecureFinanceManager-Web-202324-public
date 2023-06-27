import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {
  userTableData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData(): void {
    this.http.get<any[]>('http://localhost:8080/usermanagement/users').subscribe(
      (data) => {
        this.userTableData = data;
      },
      (error) => {
        console.log('Error fetching user data:', error);
      }
    );
  }
}
