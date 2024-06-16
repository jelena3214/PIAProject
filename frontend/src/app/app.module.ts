import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { StartingPageComponent } from './starting-page/starting-page.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RegisterGuestComponent } from './register-guest/register-guest.component';
import { GuestStartComponent } from './guest-start/guest-start.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordSafeqaComponent } from './forgot-password-safeqa/forgot-password-safeqa.component';
import { ForgotPasswordChangePassComponent } from './forgot-password-change-pass/forgot-password-change-pass.component';
import { GuestRestaurantComponent } from './guest-restaurant/guest-restaurant.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';
import { AdminStartComponent } from './admin-start/admin-start.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminUpdateUserComponent } from './admin-update-user/admin-update-user.component';
import { AdminWaitersComponent } from './admin-waiters/admin-waiters.component';
import { AdminRestaurantComponent } from './admin-restaurant/admin-restaurant.component';
import { AdminUpdateRestaurantComponent } from './admin-update-restaurant/admin-update-restaurant.component';
import { MakeReservationComponent } from './make-reservation/make-reservation.component';
import { AddDishesComponent } from './add-dishes/add-dishes.component';
import { GuestDeliveryComponent } from './guest-delivery/guest-delivery.component';
import { MakeDeliveryRequestComponent } from './make-delivery-request/make-delivery-request.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StartingPageComponent,
    RegisterGuestComponent,
    GuestStartComponent,
    ForgotPasswordComponent,
    ForgotPasswordSafeqaComponent,
    ForgotPasswordChangePassComponent,
    GuestRestaurantComponent,
    RestaurantDetailComponent,
    AdminStartComponent,
    AdminLoginComponent,
    AdminUpdateUserComponent,
    AdminWaitersComponent,
    AdminRestaurantComponent,
    AdminUpdateRestaurantComponent,
    MakeReservationComponent,
    AddDishesComponent,
    GuestDeliveryComponent,
    MakeDeliveryRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
