import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from "./views/authentication/sign-up/sign-up.component";
import {SignInComponent} from "./views/authentication/sign-in/sign-in.component";
import {AuthenticationComponent} from "./views/authentication/authentication.component";
import {LoggedInHomepageComponent} from "./views/logged-in-homepage/logged-in-homepage.component";
import {OverviewComponent} from "./views/logged-in-homepage/overview/overview.component";
import {CategoriesComponent} from "./views/logged-in-homepage/categories/categories.component";
import {CreateCategoryComponent} from "./views/logged-in-homepage/categories/create-category/create-category.component";
import {Subcategories} from "./views/logged-in-homepage/categories/subcategories/subcategories.component";
import {
  CreateSubcategoryComponent
} from "./views/logged-in-homepage/categories/subcategories/create-subcategory/create-subcategory.component";
import {LabelsComponent} from "./views/logged-in-homepage/labels/labels.component";
import {DiagramsComponent} from "./views/logged-in-homepage/diagrams/diagrams.component";

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
      {path: '', redirectTo: 'overview', pathMatch: 'full'},
      {path: 'overview', component: OverviewComponent},
      {path: 'categories', component: CategoriesComponent},
        {path: 'create-category', component: CreateCategoryComponent},
        {path: 'subcategories/:categoryId', component: Subcategories},
        {path: 'create-subcategory/:categoryId', component: CreateSubcategoryComponent},
      {path: 'labels', component: LabelsComponent},
      {path: 'diagrams', component: DiagramsComponent},
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
