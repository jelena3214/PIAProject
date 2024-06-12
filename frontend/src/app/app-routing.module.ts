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
import { AdminStartComponent } from './admin-start/admin-start.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { adminLoginGuard } from './admin-login.guard';
import { guestGuardGuard } from './guest-guard.guard';
import { AdminUpdateUserComponent } from './admin-update-user/admin-update-user.component';
import { AdminWaitersComponent } from './admin-waiters/admin-waiters.component';
import { AdminRestaurantComponent } from './admin-restaurant/admin-restaurant.component';

const routes: Routes = [
  {path:"", component:StartingPageComponent},
  {path:"login", component:LoginComponent},
  {path:"registerGuest", component:RegisterGuestComponent},
  {path:"guestStart", component:GuestStartComponent, canActivate: [guestGuardGuard]},
  {path:"guestRestaurant", component:GuestRestaurantComponent, canActivate: [guestGuardGuard]},
  {path:"forgotPassword", component:ForgotPasswordComponent},
  {path: 'forgotPassword/:username', component: ForgotPasswordSafeqaComponent, canActivate: [guestGuardGuard] },
  {path: 'forgotPasswordChange/:username', component: ForgotPasswordChangePassComponent, canActivate: [guestGuardGuard] },
  {path: 'restaurant/:id', component: RestaurantDetailComponent, canActivate: [guestGuardGuard] },
  {path: 'adminStart', component: AdminStartComponent, canActivate: [adminLoginGuard] },
  {path: 'adminLogin', component: AdminLoginComponent, canActivate: [adminLoginGuard] },
  { path: 'admin-update-user/:username', component: AdminUpdateUserComponent, canActivate: [adminLoginGuard]  },
  { path: 'adminWaiters', component: AdminWaitersComponent, canActivate: [adminLoginGuard]  },
  { path: 'adminRestaurant', component: AdminRestaurantComponent, canActivate: [adminLoginGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
