import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from "./views/authentication/sign-up/sign-up.component";
import {SignInComponent} from "./views/authentication/sign-in/sign-in.component";
import {AuthenticationComponent} from "./views/authentication/authentication.component";
import {LoggedInHomepageComponent} from "./views/logged-in-homepage/logged-in-homepage.component";
import {LoggedInOverviewComponent} from "./views/logged-in-homepage/logged-in-overview/logged-in-overview.component";
import {
  LoggedInCategoriesComponent
} from "./views/logged-in-homepage/logged-in-categories/logged-in-categories.component";
import {LoggedInLabelsComponent} from "./views/logged-in-homepage/logged-in-labels/logged-in-labels.component";
import {LoggedInDiagramsComponent} from "./views/logged-in-homepage/logged-in-diagrams/logged-in-diagrams.component";

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
      {path: 'logged-in-overview', component: LoggedInOverviewComponent},
      {path: 'logged-in-categories', component: LoggedInCategoriesComponent},
      {path: 'logged-in-labels', component: LoggedInLabelsComponent},
      {path: 'logged-in-diagrams', component: LoggedInDiagramsComponent},
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
