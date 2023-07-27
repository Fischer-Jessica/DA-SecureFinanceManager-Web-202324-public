import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module'; // Import the AppRoutingModule
import {AppComponent} from './app.component';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from './sign-in/sign-in.component';
import {AuthentificationComponent} from './authentification/authentification.component';
import {ImprintComponent} from './imprint/imprint.component';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from "@angular/common";
import {LoggedInHomepageNavbarComponent} from './logged-in-homepage-navbar/logged-in-homepage-navbar.component';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    AuthentificationComponent,
    ImprintComponent,
    LoggedInHomepageNavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule // Add the AppRoutingModule to the imports array
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
