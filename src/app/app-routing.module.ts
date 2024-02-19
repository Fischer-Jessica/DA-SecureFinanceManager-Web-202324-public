import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from "./views/authentication/register/register.component";
import {LoginComponent} from "./views/authentication/login/login.component";
import {AuthenticationComponent} from "./views/authentication/authentication.component";
import {LoggedInHomepageComponent} from "./views/logged-in-homepage/logged-in-homepage.component";
import {OverviewComponent} from "./views/logged-in-homepage/overview/overview.component";
import {CategoriesComponent} from "./views/logged-in-homepage/categories/categories.component";
import {CreateCategoryComponent} from "./views/logged-in-homepage/categories/create-category/create-category.component";
import {SubcategoriesComponent} from "./views/logged-in-homepage/categories/subcategories/subcategories.component";
import {
  CreateSubcategoryComponent
} from "./views/logged-in-homepage/categories/subcategories/create-subcategory/create-subcategory.component";
import {LabelsComponent} from "./views/logged-in-homepage/labels/labels.component";
import {DiagramsComponent} from "./views/logged-in-homepage/diagrams/diagrams.component";
import {EntriesComponent} from "./views/logged-in-homepage/categories/subcategories/entries/entries.component";
import {
  CreateEntryComponent
} from "./views/logged-in-homepage/categories/subcategories/entries/create-entry/create-entry.component";
import {CreateLabelComponent} from "./views/logged-in-homepage/labels/create-label/create-label.component";
import {UpdateCategoryComponent} from "./views/logged-in-homepage/categories/update-category/update-category.component";
import {UpdateLabelComponent} from "./views/logged-in-homepage/labels/update-label/update-label.component";
import {
  UpdateSubcategoryComponent
} from "./views/logged-in-homepage/categories/subcategories/update-subcategory/update-subcategory.component";
import {UserComponent} from "./views/logged-in-homepage/user/user.component";
import {
  UpdateEntryComponent
} from "./views/logged-in-homepage/categories/subcategories/entries/update-entry/update-entry.component";
import {TeamComponent} from "./views/imprint/team/team.component";
import {ContactComponent} from "./views/imprint/contact/contact.component";

const routes: Routes = [
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'register', component: RegisterComponent},
      {path: 'login', component: LoginComponent},
      {path: 'logged-in-homepage', component: LoggedInHomepageComponent}
    ]
  },
  {
    path: 'logged-in-homepage',
    component: LoggedInHomepageComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'create-category', component: CreateCategoryComponent },
      { path: 'update-category/:categoryId', component: UpdateCategoryComponent },
      { path: 'subcategories/:categoryId', component: SubcategoriesComponent },
      { path: 'create-subcategory/:categoryId', component: CreateSubcategoryComponent },
      { path: 'update-subcategory/:categoryId/:subcategoryId', component: UpdateSubcategoryComponent },
      { path: 'entries/:categoryId/:subcategoryId', component: EntriesComponent },
      { path: 'create-entry/:categoryId/:subcategoryId', component: CreateEntryComponent },
      {path: 'update-entry/:categoryId/:subcategoryId/:entryId', component: UpdateEntryComponent},
      { path: 'labels', component: LabelsComponent },
      { path: 'create-label', component: CreateLabelComponent },
      { path: 'update-label/:labelId', component: UpdateLabelComponent },
      {path: 'labels/:labelId/entries', component: EntriesComponent},
      { path: 'diagrams', component: DiagramsComponent },
      {path: 'user', component: UserComponent},
    ]
  },
  { path: '', redirectTo: 'authentication', pathMatch: 'full' },
  {path: 'team', component: TeamComponent},
  {path: 'contact', component: ContactComponent},
];


// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
