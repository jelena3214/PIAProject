import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register-teacher',
  templateUrl: './register-teacher.component.html',
  styleUrls: ['./register-teacher.component.css']
})

export class RegisterTeacherComponent {
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
  photo:File|null = null
  cv:File|null = null
  message:string = ""
  imageWidth:number = 0
  imageHeight:number = 0
  other:string = ""
  source:string = ""

  subjects = [
    { label: 'Matematika', value: 'math' },
    { label: 'Fizika', value: 'physics' },
    { label: 'Hemija', value: 'chemistry' },
    { label: 'Informatika', value: 'info' },
    { label: 'Programiranje', value: 'programming' },
    { label: 'Srpski jezik i književnost', value: 'srb' },
    { label: 'Engleski jezik', value: 'eng' },
    { label: 'Nemački jezik', value: 'ger' },
    { label: 'Italijanski jezik', value: 'ita' },
    { label: 'Francuski jezik', value: 'fra' },
    { label: 'Španski jezik', value: 'spa' },
    { label: 'Latinski jezik', value: 'lat' },
    { label: 'Biologija', value: 'bio' },
    { label: 'Istorija', value: 'hist' },
    { label: 'Geografija', value: 'geo' },
    { label: 'Svet oko nas', value: 'world' },
    { label: 'Nešto drugo', value: 'other' }
  ];
  selectedSubjects: { [key: string]: boolean } = {};

  grades = [
    { label: 'Osnovna škola 1-4 razred', value: 'os1' },
    { label: 'Osnovna škola 5-8 razred', value: 'os2' },
    { label: 'Srednja škola', value: 'sr' }
  ];
  selectedGrades: { [key: string]: boolean } = {};

  onFileSelected(event: any) {
    this.photo = event.target.files[0] as File;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(this.photo);
  }

  onFileSelectedCV(event: any) {
    this.cv = event.target.files[0] as File;
  }

  registerUser(){
    // lozinka
    console.log("OVDe")
    const regex = /^(?=.*[A-Z])(?=.*[a-z]{3})(?=.*\d)(?=.*[!@#$%^&*()-_+=])[A-Za-z][A-Za-z\d!@#$%^&*()-_+=]{5,9}$/;

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
    if (!emailRegex.test(this.email)) {
      this.message = "Mejl nije u dobrom formatu!"
      return
    }

    let usePhoto = false;

    if (!this.photo) {
      usePhoto = true;
    }else{
      if (this.imageWidth > 300  || this.imageWidth < 100 || this.imageHeight > 300  || this.imageHeight < 100) {
        this.message = 'Slika nije dozvoljene velicine.';
        return;
      }

      const allowedFormats = ['image/jpeg', 'image/png'];
      if (!allowedFormats.includes(this.photo.type)) {
        this.message = 'Slika nije u dozvoljenom formatu. Dozvoljeni formati su JPG i PNG.';
        return;
      }
    }

    if(this.cv){
      if (!this.cv.type.includes('pdf')) {
        this.message = 'Format fajla mora biti PDF.';
        return;
      }
      const maxSizeBytes = 3 * 1024 * 1024;
      if (this.cv.size > maxSizeBytes) {
        this.message = 'Veličina fajla ne sme biti veća od 3 MB.';
        return;
      }
    }

    let selectedSubjectValues = this.subjects.filter(subject => this.selectedSubjects[subject.value] && subject.value !== 'other').map(subject => subject.value);

    if(this.selectedSubjects['other']){
      selectedSubjectValues.push(this.other);
    }

    let selectedGradesValues = this.grades.filter(grade => this.selectedGrades[grade.value]).map(grade => grade.value);

    console.log(selectedGradesValues)
    console.log(selectedSubjectValues)

    const imagePath = 'upload/user.png';
    let newTeacher = new User(this.name, this.lastName, this.username, this.password, this.gender, this.adr, this.phone, this.email, "nastavnik", false, "", 0, {pitanje:this.safeQuestion, odgovor:this.safeResponse}, imagePath, {zeljeniPredmeti:selectedSubjectValues, zeljeniRazredi:selectedGradesValues, izvor:this.source}, "");

    this.userService.register(newTeacher).subscribe(
      (msg)=>{
        this.message = msg.mess;
        if(msg.code == 1){
          this.message = "Greska na serveru";
          return;
        }else if(msg.code == 2){
          this.message = "Korisnik sa datim korisnickim imenom vec postoji!"
          return;
        }else if(msg.code == 3){
          this.message = "Korisnik sa datim mejlom vec postoji!"
          return;
        }else{
          //success
          if(usePhoto == false){
            this.userService.uploadPhoto(this.photo, this.username).subscribe()
          }
          this.userService.uploadCV(this.cv, this.username).subscribe()
        }
      }
    )
  }
}
