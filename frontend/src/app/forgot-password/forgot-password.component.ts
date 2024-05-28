import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  constructor(private userService:UserService, private router:Router){}


  username:string = ""
  message:string = ""

  changePassword(){
    this.userService.getUsersSafeQA(this.username).subscribe(
      (safeQA)=>{
        if(safeQA){
          localStorage.setItem("safe", JSON.stringify(safeQA));
          this.router.navigate(['/forgotPassword', this.username])
        }else{
          this.message = "Korisnik ne postoji."
        }
      }
    )

  }
}
