import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {AuthentificationComponent} from "./authentification/authentification.component";
import {LoggedInHomepageNavbarComponent} from "./logged-in-homepage-navbar/logged-in-homepage-navbar.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/sign-up', // Die gewünschte Startseite
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthentificationComponent,
    children: [
      {path: 'sign-up', component: SignUpComponent},
      {path: 'sign-in', component: SignInComponent},
      {path: 'logged-in-homepage', component: LoggedInHomepageNavbarComponent}
    ]
  },
  {
    path: '',
    redirectTo: '/logged-in-homepage',
    pathMatch: 'full'
  }
];


// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
