import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router) { }

  ngOnInit() {
    alert("Log out successfully");
    localStorage.setItem("currentUser", "false");
    localStorage.setItem("userName",'')
    localStorage.setItem("userId",'')
    this.router.navigate(["/login/"]);//, this.data[0].UserId]);
  }
}
