import { Component, OnInit } from '@angular/core';
import { SafeQA } from '../models/safeqa';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password-safeqa',
  templateUrl: './forgot-password-safeqa.component.html',
  styleUrls: ['./forgot-password-safeqa.component.css']
})
export class ForgotPasswordSafeqaComponent implements OnInit{

  username:string = ""
  answer:string = ""
  message:string = ""

  qa:SafeQA | null = null
  constructor(private route:ActivatedRoute, private router:Router){}

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.username = params['username'];
    })
    this.qa = JSON.parse(localStorage.getItem('safe') || "")
  }

  checkAnswer(){
    if(this.answer != this.qa?.answer){
      this.message = "Pogrešan odgovor!"
    }else{
      localStorage.removeItem("safe")
      this.router.navigate(['/forgotPasswordChange', this.username])
    }
  }

}
