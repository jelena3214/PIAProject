import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  // constructor(private userService:UserService, private router:Router){}


  // username:string = ""
  // answer:string = ""
  // newPass1:string = ""
  // newPass2:string = ""
  // correct:boolean = false;
  // message:string = ""

  // checkAnswer(){
  //   this.userService.checkAnswer(this.username, this.answer).subscribe(
  //     (msg)=>{
  //       if(msg.code == 0)this.correct = true;
  //     }
  //   )
  // }

  // changePassword(){
  //   if(this.newPass1 != this.newPass2){
  //     this.message = "Unete lozinke se ne poklapaju!"
  //     return;
  //   }

  //   const regex = /^(?=.*[A-Z])(?=.*[a-z]{3})(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z][A-Za-z\d!@#$%^&*()-_+=]{5,9}$/;

  //   if(!regex.test(this.newPass1)){
  //     this.message = "Lozinka nije u dobrom formatu!"
  //     return
  //   }

  //   this.userService.changePassword(this.username, this.newPass1).subscribe(
  //     (msg)=>{
  //       if(msg.code == 0){
  //         this.router.navigate(['login']);
  //       }
  //     }
  //   )
  // }
}
