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
import { ConfirmDialogComponent } from './_components/confirm-dialog/confirm-dialog.component';
import { ListarTipoPagamentoComponent } from './_pages/tipoPagamento/listar-tipo-pagamento/listar-tipo-pagamento.component';
import { ModalTipoPagamentoComponent } from './_pages/tipoPagamento/modal-tipo-pagamento/modal-tipo-pagamento.component';
import { TabelaComponent } from './_components/tabela/tabela.component';
import { ListarFormaPagamentoComponent } from './_pages/formaPagamento/listar-forma-pagamento/listar-forma-pagamento.component';
import { ModalFormaPagamentoComponent } from './_pages/formaPagamento/modal-forma-pagamento/modal-forma-pagamento.component';
import { ListarFornecedorComponent } from './_pages/fornecedor/listar-fornecedor/listar-fornecedor.component';
import { ModalFornecedorComponent } from './_pages/fornecedor/modal-fornecedor/modal-fornecedor.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { SelectSexComponent } from './_components/select-sex/select-sex.component';
import { ListarSalasComponent } from './_pages/sala/listar-salas/listar-salas.component';
import { ModalSalasComponent } from './_pages/sala/modal-salas/modal-salas.component';




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
    ModalStatusComponent,
    ConfirmDialogComponent,
    ListarTipoPagamentoComponent,
    ModalTipoPagamentoComponent,
    TabelaComponent,
    ListarFormaPagamentoComponent,
    ModalFormaPagamentoComponent,
    ListarFornecedorComponent,
    ModalFornecedorComponent,
    SelectSexComponent,
    ListarSalasComponent,
    ModalSalasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxMaskDirective

  ],
  providers: [ provideNgxMask(),],
  bootstrap: [AppComponent]
})
export class AppModule { }
