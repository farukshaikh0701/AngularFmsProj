import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './set-password.component.html',
  styleUrl: './set-password.component.css'
})
export class SetPasswordComponent {
  resetPasswordForm: FormGroup;
  userName:string|null="";
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    this.userName= localStorage.getItem("userName");
    this.resetPasswordForm = new FormGroup({
      userName: new FormControl(this.userName),
      password: new FormControl(""),
      confirmPassword: new FormControl(""),
    })
  }
  data: any;
  uName = '';
  pWord = '';
  cpWord = '';
  ngOnInit() {
    localStorage.setItem("currentUser", "false")
  }

  async submitSetPassword() {
    debugger;
    console.log("submit clicked");
    this.uName = this.resetPasswordForm.value["userName"];
    this.pWord = this.resetPasswordForm.value["password"]
    this.cpWord = this.resetPasswordForm.value["confirmPassword"]
    if (this.uName != null && this.uName.length <= 0) {
      alert("Username should not be blank")
      return;
    }
    if (this.pWord.length <= 0) {
      alert("Password should not be blank")
      return;
    }
    if(this.pWord!=this.cpWord)
    {
      alert("Password and Confirm password should be matched");
      return;
    }
    debugger;
    (await this.userService.updatePassword(this.resetPasswordForm.value)).subscribe((res: any) => {
      if (res) {
        this.data = res;
        if (this.data.length <= 0) {
          alert("Please check the details correctly.");
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
          alert("Password updated successfully, Redirecting to login page.")
          this.router.navigate(["/login/"]); //, this.data[0].UserId]);
          return;
        }
      }
    },
      (error) => {
        alert("Looks like you have a connectivity issue. Error: " + error.message);
      }
    )}

}
