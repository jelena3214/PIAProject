import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterGuestComponent } from './register-guest/register-guest.component';
import { GuestStartComponent } from './guest-start/guest-start.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordSafeqaComponent } from './forgot-password-safeqa/forgot-password-safeqa.component';
import { ForgotPasswordChangePassComponent } from './forgot-password-change-pass/forgot-password-change-pass.component';
import { GuestRestaurantComponent } from './guest-restaurant/guest-restaurant.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';

const routes: Routes = [
  {path:"", component:StartingPageComponent},
  {path:"login", component:LoginComponent},
  {path:"registerGuest", component:RegisterGuestComponent},
  {path:"guestStart", component:GuestStartComponent},
  {path:"guestRestaurant", component:GuestRestaurantComponent},
  {path:"forgotPassword", component:ForgotPasswordComponent},
  {path: 'forgotPassword/:username', component: ForgotPasswordSafeqaComponent },
  {path: 'forgotPasswordChange/:username', component: ForgotPasswordChangePassComponent },
  {path: 'restaurant/:id', component: RestaurantDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
