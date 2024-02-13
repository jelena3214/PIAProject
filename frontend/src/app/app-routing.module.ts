import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { RegisterTeacherComponent } from './register-teacher/register-teacher.component';
import { StudentStartComponent } from './student-start/student-start.component';
import { TeacherStartComponent } from './teacher-start/teacher-start.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {path:"", component:StartingPageComponent},
  {path:"login", component:LoginComponent},
  {path:"registerStudent", component:RegisterStudentComponent},
  {path:"registerTeacher", component:RegisterTeacherComponent},
  {path:"studentStart", component:StudentStartComponent},
  {path:"teacherStart", component:TeacherStartComponent},
  {path:"forgotPassword", component:ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
