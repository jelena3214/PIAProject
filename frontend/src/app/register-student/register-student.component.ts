import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent {
  constructor(private userService:UserService){}

  username:string = ""
  password:string = ""
  safeQuestion: string= ""
  safeResponse:string = ""
  name:string = ""
  lastName:string = ""
  gender:string = ""
  adr:string = ""
  phone:string = ""
  email:string = ""
  schoolType:string = ""
  grade:number = 0
  photo:File|null = null
  message:string = ""

  onFileSelected(event: any) {
    this.photo = event.target.files[0] as File;
  }

  registerUser(){
    // lozinka
    console.log("OVDe")
    const regex = /^(?=.*[A-Z])(?=.*[a-z]{3,})(?=.*\d)(?=.*[@$!%*?&])[A-Za-z]\w{5,9}$/;

    if(!regex.test(this.password)){
      this.message = "Lozinka nije u dobrom formatu!"
      return
    }

    const phoneRegex = /^\+3816\d{8,9}$/;
    if(!phoneRegex.test(this.phone)){
      this.message = "Telefon nije u dobrom formatu!"
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(this.email)) {
      this.message = "Mejl nije u dobrom formatu!"
      return
    }

    if(this.grade < 1 || this.grade > 8){
      this.message = "Razred nije validan!";
      return;
    }

    if(this.schoolType != "osnovna" && this.grade > 4){
      this.message = "Razred nije validan za taj stepen obrazovanja!";
      return
    }

    if (!this.photo) {
      this.message = "Morate dodati sliku!"
      return;
    }

    let newStudent = new User(this.username, this.password, this.safeQuestion, this.safeResponse, this.name, this.lastName, this.gender, this.adr, this.phone, this.email, "", this.schoolType);

    this.userService.registerStudent(newStudent).subscribe(
      (msg)=>{
        this.message = msg.mess;
        if(msg.code != 0){
          return;
        }else{
          //success
          this.userService.uploadPhoto(this.photo).subscribe(
            (user)=>{
              console.log(user);
            }
          )
        }
      }
    )
  }
}
