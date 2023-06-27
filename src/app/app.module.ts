import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { UsertableComponent } from './usertable/usertable.component';
import { MainComponent } from './main/main.component'; // Passe den Pfad entsprechend deiner Ordnerstruktur an


@NgModule({
  declarations: [
    AppComponent,
    UsertableComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
