import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password-change-pass',
  templateUrl: './forgot-password-change-pass.component.html',
  styleUrls: ['./forgot-password-change-pass.component.css']
})
export class ForgotPasswordChangePassComponent implements OnInit{
  username:string = ""
  message:string = ""
  newPass1:string = ""
  newPass2:string = ""

  constructor(private route:ActivatedRoute, private router:Router, private userService:UserService){}

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.username = params['username'];
    })
  }

  changePassword(){
    if(this.newPass1 != this.newPass2){
      this.message = "Unete lozinke se ne poklapaju!"
      return;
    }

    const regex = /^(?=.*[A-Z])(?=.*[a-z]{3})(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z][A-Za-z\d!@#$%^&*()-_+=]{5,9}$/;

    if(!regex.test(this.newPass1)){
      this.message = "Lozinka nije u dobrom formatu!"
      return
    }

    this.userService.changePassword(this.username, this.newPass1).subscribe(
      (msg)=>{
        if(msg.code == 0){
          this.router.navigate(['login']);
        }
      }
    )
  }

}
