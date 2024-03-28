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
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signUpForm: FormGroup;
  firstName: string = "";
  lastName: string = "";
  mobileNumber: string = "";
  email: string = "";
  dateOfbirth: string = "";
  address: string = "";
  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    console.log("in class");
    localStorage.setItem("currentUser", "false")
    this.signUpForm = new FormGroup({
      firstName: new FormControl(""),
      lastName: new FormControl(""),
      mobileNumber: new FormControl(""),
      email: new FormControl(""),
      userName: new FormControl(""),
      password: new FormControl(""),
      address:new FormControl(""),
      dateOfbirth: new FormControl("")
    })
  }
  data: any;
  ngOnInit() {
    localStorage.setItem("currentUser", "false")
  }

  async submitSignUp() {
    debugger;
    console.log("submit clicked");
    this.firstName = this.signUpForm.value["firstName"];
    this.lastName = this.signUpForm.value["lastName"];
    this.mobileNumber = this.signUpForm.value["mobileNumber"];
    this.email = this.signUpForm.value["email"];
    this.dateOfbirth = this.signUpForm.value["dateOfbirth"];
    this.address = this.signUpForm.value["address"];
    if (this.firstName != null && this.firstName.length <= 0) {
      alert("First name should not be blank")
      return;
    }
    if (this.mobileNumber.length <= 0) {
      alert("Please provide mobile number")
      return;
    }
    if (this.email.length <= 0) {
      alert("Please provide emailId that will be useful for creating username for you")
      return;
    }

    (await this.userService.createUser(this.signUpForm.value)).subscribe((res: any) => {
      if (res) {
        debugger;
        this.data = res;
        if (this.data.length <= 0) {
          alert("Due to some technical issue user is not added. please try later.");
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
          alert("User created successfully, Welcome to FS Collection");
          this.router.navigate(["/dashboard/"]); //, this.data[0].UserId]);
        }
      } else {
        alert("Something went wrong ")
        return;
      }
    });
  }

}
