import {Component} from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule} from '@angular/forms';
// import { UserService } from '../services/user/user.service';
import {HttpClient,HttpClientModule} from '@angular/common/http';
import {Route,Router} from '@angular/router';
import * as constants from '../constants/constants';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    console.log("in class");
    localStorage.setItem("currentUser", "false")
    this.loginForm = new FormGroup({
      username: new FormControl(""),
      password: new FormControl(""),
    })
  }
  data: any;
  uName = '';
  pWord = '';
  ngOnInit() {
    localStorage.setItem("currentUser", "false")
  }

  async submitLogin() {
    debugger;
    console.log("submit clicked");
    this.uName = this.loginForm.value["username"];
    this.pWord = this.loginForm.value["password"]
    if (this.uName != null && this.uName.length <= 0) {
      alert("Username should not be blank")
      return;
    }
    if (this.pWord.length <= 0) {
      alert("Password should not be blank")
      return;
    }
    debugger;
    (await this.userService.getUser(this.loginForm.value)).subscribe((res: any) => {
      if (res) {
        this.data = res;
        if (this.data.length <= 0) {
          alert("Invalid credentials, Please check the details correctly.");
          localStorage.setItem("currentUser", "false");
          localStorage.setItem("userName", "")
          localStorage.setItem("firstName", "")
          localStorage.setItem("userId", "")
          return;
        }

        if (this.data[0] != null && this.data[0].UserName != null && this.data[0].UserName.length > 0) {
          localStorage.setItem("currentUser", "true")
          localStorage.setItem("userName", this.data[0].UserName)
          localStorage.setItem("firstName", this.data[0].FirstName)
          localStorage.setItem("userId", this.data[0].UserId)
          alert("Log in successfully")
          this.router.navigate(["/dashboard/"]); //, this.data[0].UserId]);
          return;
        }
      }
    },
      (error) => {
        alert("Looks like you have a connectivity issue. Error: " + error.message);
      }
    )}
}
