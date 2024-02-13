import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private userService:UserService, private router:Router){}

  username:string = ""
  password:string = ""
  message:string = ""

  login(){
    this.userService.login(this.username, this.password).subscribe(
      (user)=>{
        if(user == null){
          this.message = "Korisnik ne postoji!"
          return;
        }else{
          localStorage.setItem("user", JSON.stringify(user));
          if(user.tip == 'student'){
            this.router.navigate(['studentStart']);
          }else{
            this.router.navigate(['teacherStart']);
          }
        }
      }
    )
  }

}
