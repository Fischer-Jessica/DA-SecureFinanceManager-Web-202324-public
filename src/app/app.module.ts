import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {CommonModule} from "@angular/common";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {AuthenticationComponent} from './views/authentication/authentication.component';
import {ImprintComponent} from './views/imprint/imprint.component';
import {NavbarComponent} from "./views/logged-in-homepage/navbar/navbar.component";
import {LoggedInHomepageComponent} from './views/logged-in-homepage/logged-in-homepage.component';
import {CategoriesComponent} from "./views/logged-in-homepage/categories/categories.component";
import {LabelsComponent} from "./views/logged-in-homepage/labels/labels.component";
import {CreateCategoryComponent} from "./views/logged-in-homepage/categories/create-category/create-category.component";
import {SubcategoriesComponent} from "./views/logged-in-homepage/categories/subcategories/subcategories.component";
import {
  CreateSubcategoryComponent
} from "./views/logged-in-homepage/categories/subcategories/create-subcategory/create-subcategory.component";
import {EntriesComponent} from './views/logged-in-homepage/categories/subcategories/entries/entries.component';
import {
  CreateEntryComponent
} from './views/logged-in-homepage/categories/subcategories/entries/create-entry/create-entry.component';
import {CreateLabelComponent} from './views/logged-in-homepage/labels/create-label/create-label.component';
import {ColourPickerComponent} from './views/logged-in-homepage/colour-picker/colour-picker.component';
import {UpdateCategoryComponent} from './views/logged-in-homepage/categories/update-category/update-category.component';
import {UpdateLabelComponent} from './views/logged-in-homepage/labels/update-label/update-label.component';
import {
  UpdateSubcategoryComponent
} from './views/logged-in-homepage/categories/subcategories/update-subcategory/update-subcategory.component';
import {UserComponent} from './views/logged-in-homepage/user/user.component';
import {
  UpdateEntryComponent
} from './views/logged-in-homepage/categories/subcategories/entries/update-entry/update-entry.component';
import {TeamComponent} from './views/imprint/team/team.component';
import {ContactComponent} from './views/imprint/contact/contact.component';
import {RegisterComponent} from "./views/authentication/register/register.component";
import {LoginComponent} from "./views/authentication/login/login.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    RegisterComponent,
    LoginComponent,
    ImprintComponent,
    NavbarComponent,
    LoggedInHomepageComponent,
    CategoriesComponent,
    LabelsComponent,
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
    BrowserAnimationsModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private translateService: TranslateService) {
    translateService.addLangs(['en', 'de'])
    translateService.setDefaultLang('en');
    translateService.use('de');
  }
}
