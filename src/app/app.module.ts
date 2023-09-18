import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// own Components
import {AppComponent} from './app.component';


import {AuthenticationComponent} from './authentication/authentication.component';

import {SignUpComponent} from "./authentication/sign-up/sign-up.component";
import {SignInComponent} from './authentication/sign-in/sign-in.component';


import {LoggedInHomepageComponent} from './logged-in-homepage/logged-in-homepage.component';

import {
  LoggedInHomepageNavbarComponent
} from './logged-in-homepage/logged-in-homepage-navbar/logged-in-homepage-navbar.component';

import {LoggedInOverviewComponent} from './logged-in-homepage/logged-in-overview/logged-in-overview.component';
import {LoggedInCategoriesComponent} from './logged-in-homepage/logged-in-categories/logged-in-categories.component';
import {LoggedInLabelsComponent} from './logged-in-homepage/logged-in-labels/logged-in-labels.component';
import {LoggedInDiagramsComponent} from './logged-in-homepage/logged-in-diagrams/logged-in-diagrams.component';

import {ImprintComponent} from './imprint/imprint.component';

// routing - imports
import {AppRoutingModule} from './app-routing.module'; // Import the AppRoutingModule
// forms - imports
import {FormsModule} from '@angular/forms';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from "@angular/common";

// Translation - imports
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Design - imports
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    AuthenticationComponent,
    ImprintComponent,
    LoggedInHomepageNavbarComponent,
    LoggedInHomepageComponent,
    LoggedInOverviewComponent,
    LoggedInCategoriesComponent,
    LoggedInLabelsComponent,
    LoggedInDiagramsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    MatButtonModule,
    // Add the AppRoutingModule to the imports array
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
