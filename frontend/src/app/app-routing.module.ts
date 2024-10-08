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
import { AdminUpdateRestaurantComponent } from './admin-update-restaurant/admin-update-restaurant.component';
import { MakeReservationComponent } from './make-reservation/make-reservation.component';
import { AddDishesComponent } from './add-dishes/add-dishes.component';
import { GuestDeliveryComponent } from './guest-delivery/guest-delivery.component';
import { MakeDeliveryRequestComponent } from './make-delivery-request/make-delivery-request.component';
import { GuestReservationComponent } from './guest-reservation/guest-reservation.component';
import { WaiterStartComponent } from './waiter-start/waiter-start.component';
import { waiterGuardGuard } from './waiter-guard.guard';
import { WaiterReservationsComponent } from './waiter-reservations/waiter-reservations.component';
import { WaiterDeliveryComponent } from './waiter-delivery/waiter-delivery.component';
import { WaiterStatisticsComponent } from './waiter-statistics/waiter-statistics.component';
import { notloggedinGuard } from './notloggedin.guard';

const routes: Routes = [
  {path:"", component:StartingPageComponent, canActivate: [notloggedinGuard]},
  {path:"login", component:LoginComponent, canActivate: [notloggedinGuard]},
  {path:"registerGuest", component:RegisterGuestComponent, canActivate: [notloggedinGuard]},
  {path:"guestStart", component:GuestStartComponent, canActivate: [guestGuardGuard]},
  {path:"guestRestaurant", component:GuestRestaurantComponent, canActivate: [guestGuardGuard]},
  {path:"forgotPassword", component:ForgotPasswordComponent, canActivate: [notloggedinGuard]},
  {path: 'forgotPassword/:username', component: ForgotPasswordSafeqaComponent, canActivate: [guestGuardGuard] },
  {path: 'forgotPasswordChange/:username', component: ForgotPasswordChangePassComponent, canActivate: [guestGuardGuard] },
  {path: 'restaurant/:id', component: RestaurantDetailComponent, canActivate: [guestGuardGuard] },
  {path: 'adminStart', component: AdminStartComponent, canActivate: [adminLoginGuard] },
  {path: 'adminLogin', component: AdminLoginComponent, canActivate: [adminLoginGuard] },
  { path: 'admin-update-user/:username', component: AdminUpdateUserComponent, canActivate: [adminLoginGuard]  },
  { path: 'adminWaiters', component: AdminWaitersComponent, canActivate: [adminLoginGuard]  },
  { path: 'adminRestaurant', component: AdminRestaurantComponent, canActivate: [adminLoginGuard]  },
  { path: 'admin-update-restaurant/:restaurantId', component: AdminUpdateRestaurantComponent, canActivate: [adminLoginGuard]  },
  { path: 'add-dishes/:restaurantId', component: AddDishesComponent, canActivate: [adminLoginGuard]  },
  { path: 'make-reservation/:restaurantId', component: MakeReservationComponent, canActivate: [guestGuardGuard]  },
  { path: 'make-delivery-request/:restaurantId', component: MakeDeliveryRequestComponent, canActivate: [guestGuardGuard]  },
  { path: 'guestDelivery', component: GuestDeliveryComponent, canActivate: [guestGuardGuard]  },
  { path: 'guestReservation', component: GuestReservationComponent, canActivate: [guestGuardGuard]  },
  { path: 'waiterStart', component: WaiterStartComponent, canActivate: [waiterGuardGuard]  },
  { path: 'waiterReservations', component: WaiterReservationsComponent, canActivate: [waiterGuardGuard]  },
  { path: 'waiterDelivery', component: WaiterDeliveryComponent, canActivate: [waiterGuardGuard]  },
  { path: 'waiterStatistics', component: WaiterStatisticsComponent, canActivate: [waiterGuardGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
