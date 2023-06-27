import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.css']
})
export class UsertableComponent implements OnInit {
  userTableData: any[] = [];
  refreshInterval: any; // Variable to hold the interval reference

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.startAutoRefresh(); // Start the auto-refresh mechanism
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

  startAutoRefresh(): void {
    // Set the refresh interval (e.g., every 5 seconds)
    this.refreshInterval = setInterval(() => {
      this.fetchUserData(); // Fetch the latest data
    }, 5000); // Adjust the interval duration as needed
  }

  stopAutoRefresh(): void {
    // Clear the refresh interval when needed
    clearInterval(this.refreshInterval);
  }
}
