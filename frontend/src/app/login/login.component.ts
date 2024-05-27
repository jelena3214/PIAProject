import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
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
        }else if (user.aktivan){
          localStorage.setItem("user", JSON.stringify(user));
          if(user.tip == 'gost'){
            this.router.navigate(['guestStart']);
          }else{
            this.router.navigate(['konobarStart']);
          }
        }else{
          this.message = "Još niste aktivan korisnik."
        }
      }
    )
  }

}
