import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import {
  Component
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  UserService
} from '../../services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  data: any;
  firstName: string = "";
  userName: string = "";
  mobileNumber: string = "";

  redirectToLogin() {
    this.router.navigate(["/login/"]);
  }

  forgetPasswordForm: FormGroup;
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    this.forgetPasswordForm = new FormGroup({
      firstName: new FormControl(""),
      userName: new FormControl(""),
      mobileNumber: new FormControl(""),
    })
  }
  ngOnInit() {
    localStorage.setItem("currentUser", "false")
  }

  validateDetails() {
    this.firstName = this.forgetPasswordForm.value["firstName"];
    this.userName = this.forgetPasswordForm.value["userName"];
    this.mobileNumber = this.forgetPasswordForm.value["mobileNumber"];
    if(this.firstName!=null && this.firstName.length<=0)
    {
      alert("First name should not be blank")
      return;
    }
    if(this.userName.length<=0)
    {
      alert("Please provide username")
      return;
    }
    if(this.mobileNumber.length<=0)
    {
      alert("Please provide mobile number")
      return;
    }
    debugger
    this.verifyDetails(this.forgetPasswordForm.value)

  }
  async verifyDetails(forgetPasswordForm :FormGroup ) {
    debugger;
    (await this.userService.verifyUser(forgetPasswordForm)).subscribe((res: any) => {
      debugger;
      if (res) {
        debugger;
        this.data = res;
        if (this.data.length <= 0) {
          alert("You have entered wrong details, Please check the details again.");
          localStorage.setItem("currentUser", "false");
          localStorage.setItem("userName", "")
          localStorage.setItem("userId", "")
          return;
        }

        if (this.data[0] != null && this.data[0].UserName != null && this.data[0].UserName.length > 0) {
          localStorage.setItem("currentUser", "true")
          localStorage.setItem("userName", this.data[0].UserName)
          localStorage.setItem("userId", this.data[0].UserId)
          alert("Details are verified. redirecting to set your password");
    this.router.navigate(["/set-password/"]);
        }
      } else {
        alert("Something went wrong ")
        return;
      }
    });
  }
}
