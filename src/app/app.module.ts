import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// own Components
import {AppComponent} from './app.component';


import {AuthenticationComponent} from './views/authentication/authentication.component';

import {SignUpComponent} from "./views/authentication/sign-up/sign-up.component";
import {SignInComponent} from './views/authentication/sign-in/sign-in.component';


import {LoggedInHomepageComponent} from './views/logged-in-homepage/logged-in-homepage.component';

import {
  NavbarComponent
} from './views/logged-in-homepage/logged-in-homepage-navbar/navbar.component';

import {OverviewComponent} from './views/logged-in-homepage/logged-in-overview/overview.component';
import {
  CategoriesComponent
} from './views/logged-in-homepage/logged-in-categories/categories.component';
import {LabelsComponent} from './views/logged-in-homepage/logged-in-labels/labels.component';
import {DiagramsComponent} from './views/logged-in-homepage/logged-in-diagrams/diagrams.component';

import {ImprintComponent} from './views/imprint/imprint.component';

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
import { CreateNewCategoryComponent } from './views/logged-in-homepage/logged-in-categories/create-new-category/create-new-category.component';
import { Subcategories } from './views/logged-in-homepage/logged-in-categories/subcategory/subcategories.component';
import { CreateNewSubcategoryComponent } from './views/logged-in-homepage/logged-in-categories/subcategory/create-new-subcategory/create-new-subcategory.component';

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
    NavbarComponent,
    LoggedInHomepageComponent,
    OverviewComponent,
    CategoriesComponent,
    LabelsComponent,
    DiagramsComponent,
    CreateNewCategoryComponent,
    Subcategories,
    CreateNewSubcategoryComponent
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
