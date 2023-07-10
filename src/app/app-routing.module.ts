import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {AuthentificationComponent} from "./authentification/authentification.component";

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
      { path: 'sign-up', component: SignUpComponent },
      { path: 'sign-in', component: SignInComponent },
    ]
  },
  // Weitere Routen
];


// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
