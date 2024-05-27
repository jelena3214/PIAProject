import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-starting-page',
  templateUrl: './starting-page.component.html',
  styleUrls: ['./starting-page.component.css']
})
export class StartingPageComponent {
  // totalStudents: number = 0;
  // totalActiveTeachers: number = 0;
  // predmetiNastavnici: any[] = [];

  // constructor(private http: HttpClient) { }

  // ngOnInit(): void {
  //   this.fetchGeneralInfo();
  //   this.getSubjectsTeachersList();
  // }

  // getSubjectsTeachersList() {
  //   this.http.get<any>('http://localhost:4000/users/subjectsTeachersList').subscribe(
  //     (response) => {
  //       this.predmetiNastavnici = response.predmeti;
  //     },
  //     (error) => {
  //       console.log('Greška pri dobijanju liste predmeta sa nastavnicima:', error);
  //     }
  //   );
  // }

  // fetchGeneralInfo() {
  //   this.http.get<any>('http://localhost:4000/users/generalInfo').subscribe(
  //     data => {
  //       this.totalStudents = data.totalStudents;
  //       this.totalActiveTeachers = data.totalActiveTeachers;
  //     },
  //     error => {
  //       console.error('Error fetching general info:', error);
  //     }
  //   );
  // }

  // sortPredmet(){
  //   this.predmetiNastavnici.sort((a, b) => {
  //     const predmetA = a.predmet.toLowerCase();
  //     const predmetB = b.predmet.toLowerCase();
  //     return predmetA.localeCompare(predmetB);
  //   });
  // }

  // sortIme(){
  //   this.predmetiNastavnici.forEach(predmet => {
  //     predmet.nastavnici.sort((a: { ime: string; prezime:string;}, b: { ime: string; prezime:string;}) => {
  //       const imeA = a.ime.toLowerCase();
  //       const imeB = b.ime.toLowerCase();
  //       return imeA.localeCompare(imeB);
  //     });
  //   });
  // }

  // sortPrezime(){
  //   this.predmetiNastavnici.forEach(predmet => {
  //     predmet.nastavnici.sort((a: { ime: string; prezime:string;}, b: { ime: string; prezime:string;}) => {
  //       const A = a.prezime.toLowerCase();
  //       const B = b.prezime.toLowerCase();
  //       return A.localeCompare(B);
  //     });
  //   });
  // }

  // ime:string = ""
  // prezime:string = ""
  // predmet:string = ""

  // pretraziNastavnike() {
  //   return this.predmetiNastavnici.filter(item => {
  //     const imeMatch = this.ime ? item.nastavnici.some((nastavnik: { ime: string; prezime:string;}) => nastavnik.ime.toLowerCase().includes(this.ime.toLowerCase())) : true;
  //     const prezimeMatch = this.prezime ? item.nastavnici.some((nastavnik: { ime:string; prezime: string; }) => nastavnik.prezime.toLowerCase().includes(this.prezime.toLowerCase())) : true;
  //     const predmetMatch = this.predmet ? item.predmet.toLowerCase().includes(this.predmet.toLowerCase()) : true;
  //     return imeMatch && prezimeMatch && predmetMatch;
  //   });
  // }


}
