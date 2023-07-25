import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module'; // Import the AppRoutingModule
import {AppComponent} from './app.component';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from './sign-in/sign-in.component';
import {AuthentificationComponent} from './authentification/authentification.component';
import {ImprintComponent} from './imprint/imprint.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    AuthentificationComponent,
    ImprintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // Add the AppRoutingModule to the imports array
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
