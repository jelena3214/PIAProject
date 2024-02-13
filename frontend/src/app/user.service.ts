import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './models/user';
import { Msg } from './models/msg';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = "http://localhost:4000";

  constructor(private http:HttpClient) { }

  register(us:User){
    const data =
    {
      user: us
    }
    return this.http.post<Msg>(`${this.url}/users/register`, data);
  }

  uploadPhoto(photo:any, user:string){
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('user', user);

    return this.http.post<any>(`${this.url}/uploadPhoto`, formData);
  }

  uploadCV(cv:any, user:string){
    const formData = new FormData();
    formData.append('file', cv);
    formData.append('user', user);

    return this.http.post<any>(`${this.url}/uploadCV`, formData);
  }

  login(username:string, pass:string){
    const data = {
      username:username,
      password:pass
    }

    return this.http.post<User>(`${this.url}/users/login`, data);
  }

  checkAnswer(username:string, answer:string){
    const data = {
      username:username,
      answer:answer
    }

    return this.http.post<Msg>(`${this.url}/users/checkAnswer`, data);
  }

  changePassword(username:string, newPass:string){
    const data = {
      username:username,
      newPassword:newPass
    }

    return this.http.post<Msg>(`${this.url}/users/changePassword`, data);
  }
}
