import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

// own Components
import {AppComponent} from './app.component';


import {AuthenticationComponent} from './views/authentication/authentication.component';

import {RegisterComponent} from "./views/authentication/register/register.component";
import {LoginComponent} from './views/authentication/login/login.component';


import {LoggedInHomepageComponent} from './views/logged-in-homepage/logged-in-homepage.component';

import {
  CreateSubcategoryComponent
} from "./views/logged-in-homepage/categories/subcategories/create-subcategory/create-subcategory.component";
import {CreateCategoryComponent} from "./views/logged-in-homepage/categories/create-category/create-category.component";
import {NavbarComponent} from "./views/logged-in-homepage/navbar/navbar.component";
import {OverviewComponent} from "./views/logged-in-homepage/overview/overview.component";
import {CategoriesComponent} from "./views/logged-in-homepage/categories/categories.component";
import {LabelsComponent} from "./views/logged-in-homepage/labels/labels.component";
import {DiagramsComponent} from "./views/logged-in-homepage/diagrams/diagrams.component";
import {SubcategoriesComponent} from "./views/logged-in-homepage/categories/subcategories/subcategories.component";

import {ImprintComponent} from './views/imprint/imprint.component';

// routing - imports
import {AppRoutingModule} from './app-routing.module'; // Import the AppRoutingModule
// forms - imports
import {FormsModule} from '@angular/forms';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CommonModule} from "@angular/common";

// Translation - imports
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// Design - imports
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";
import {EntriesComponent} from './views/logged-in-homepage/categories/subcategories/entries/entries.component';
import {
  CreateEntryComponent
} from './views/logged-in-homepage/categories/subcategories/entries/create-entry/create-entry.component';
import {CreateLabelComponent} from './views/logged-in-homepage/labels/create-label/create-label.component';
import {LabelEntriesComponent} from "./views/logged-in-homepage/labels/entries/label-entries.component";
import {ColourPickerComponent} from './views/logged-in-homepage/colour-picker/colour-picker.component';
import {UpdateCategoryComponent} from './views/logged-in-homepage/categories/update-category/update-category.component';
import {UpdateLabelComponent} from './views/logged-in-homepage/labels/update-label/update-label.component';
import {
  UpdateSubcategoryComponent
} from './views/logged-in-homepage/categories/subcategories/update-subcategory/update-subcategory.component';
import {UserComponent} from './views/logged-in-homepage/user/user.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {
  UpdateEntryComponent
} from './views/logged-in-homepage/categories/subcategories/entries/update-entry/update-entry.component';
import {TeamComponent} from './views/imprint/team/team.component';
import {ContactComponent} from './views/imprint/contact/contact.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AuthenticationComponent,
    ImprintComponent,
    NavbarComponent,
    LoggedInHomepageComponent,
    OverviewComponent,
    CategoriesComponent,
    LabelsComponent,
    LabelEntriesComponent,
    DiagramsComponent,
    CreateCategoryComponent,
    SubcategoriesComponent,
    CreateSubcategoryComponent,
    EntriesComponent,
    CreateEntryComponent,
    CreateLabelComponent,
    ColourPickerComponent,
    UpdateCategoryComponent,
    UpdateLabelComponent,
    UpdateSubcategoryComponent,
    UserComponent,
    UpdateEntryComponent,
    TeamComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
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
export class AppModule {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'de'])
    translate.setDefaultLang('en');
    translate.use('de');
  }
}
