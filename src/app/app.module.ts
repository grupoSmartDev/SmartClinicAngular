import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './_components/footer/footer.component';
import { HeaderComponent } from './_components/header/header.component';
import { SidenavComponent } from './_components/side-bar/side-bar.component';
import { SublevelMenuComponent } from './_components/side-bar/sublevel-menu.component';
import { BodyComponent } from './_components/body/body.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListarComponent } from './_pages/status/listar/listar.component';
import { LabelNomeComponent } from './_components/label-nome/label-nome.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalStatusComponent } from './_pages/status/modal-status/modal-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,    
    SidenavComponent,
    SublevelMenuComponent,
    BodyComponent,
    ListarComponent,
    LabelNomeComponent,
    ModalStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
