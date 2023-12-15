import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from "./views/authentication/sign-up/sign-up.component";
import {SignInComponent} from "./views/authentication/sign-in/sign-in.component";
import {AuthenticationComponent} from "./views/authentication/authentication.component";
import {LoggedInHomepageComponent} from "./views/logged-in-homepage/logged-in-homepage.component";
import {OverviewComponent} from "./views/logged-in-homepage/logged-in-overview/overview.component";
import {
  CategoriesComponent
} from "./views/logged-in-homepage/logged-in-categories/categories.component";
import {LabelsComponent} from "./views/logged-in-homepage/logged-in-labels/labels.component";
import {DiagramsComponent} from "./views/logged-in-homepage/logged-in-diagrams/diagrams.component";
import {
  CreateNewCategoryComponent
} from "./views/logged-in-homepage/logged-in-categories/create-new-category/create-new-category.component";
import {Subcategories} from "./views/logged-in-homepage/logged-in-categories/subcategory/subcategories.component";
import {
  CreateNewSubcategoryComponent
} from "./views/logged-in-homepage/logged-in-categories/subcategory/create-new-subcategory/create-new-subcategory.component";

const routes: Routes = [
  {
    path: 'authentication',
    component: AuthenticationComponent,
    children: [
      {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
      {path: 'sign-up', component: SignUpComponent},
      {path: 'sign-in', component: SignInComponent},
      {path: 'logged-in-homepage', component: LoggedInHomepageComponent}
    ]
  },
  {
    path: 'logged-in-homepage',
    component: LoggedInHomepageComponent,
    children: [
      {path: '', redirectTo: 'logged-in-overview', pathMatch: 'full'},
      {path: 'logged-in-overview', component: OverviewComponent},
      {path: 'logged-in-categories', component: CategoriesComponent},
        {path: 'add-category', component: CreateNewCategoryComponent},
        {path: 'subcategory/:categoryId', component: Subcategories},
        {path: 'add-subcategory/:categoryId', component: CreateNewSubcategoryComponent},
      {path: 'logged-in-labels', component: LabelsComponent},
      {path: 'logged-in-diagrams', component: DiagramsComponent},
    ]
  },
  {path: '', redirectTo: 'authentication', pathMatch: 'full'},
];


// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
