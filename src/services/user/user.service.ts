import { Injectable, inject } from '@angular/core';
import * as constants from '../../app/constants/constants';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http:HttpClient){}
  async getUser(user:any) {
    return await this.http.get(constants.USERURL +'getUser?username='+user.username+'&password='+user.password);
  }

  async verifyUser(forgetPasswordForm:any) {
    debugger;
    return await this.http.get(constants.USERURL +'verifyUser?firstName='+forgetPasswordForm.firstName+'&userName='+forgetPasswordForm.userName+'&mobileNumber='+forgetPasswordForm.mobileNumber);
  }
  async createUser(user:any): Promise<Observable<any>>  {
    return await this.http.post(constants.USERURL +'createUser', user);
  }
  async updatePassword(forgetPasswordForm:any) {
    debugger;
    return await this.http.get(constants.USERURL +'updatePassword?userName='+forgetPasswordForm.userName+'&password='+forgetPasswordForm.password);
  }

  getUserByUserId(id: number) {
    return constants.USERURL + 'getUserByUserId?userId=' + id;
  }

  getUserList() {
    return constants.USERURL + 'getUserList';
  }
}
