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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ModalConvenioComponent } from './_pages/convenio/modal-convenio/modal-convenio.component';
import { ListarConvenioComponent } from './_pages/convenio/listar-convenio/listar-convenio.component';
import { TabelaListarGenericaComponent } from './_components/tabela-listar-generica/tabela-listar-generica.component';
import { ListarConselhoComponent } from './_pages/conselho/listar-conselho/listar-conselho.component';
import { ModalConselhoComponent } from './_pages/conselho/modal-conselho/modal-conselho.component';
import { AgendaComponent } from './_pages/agenda/agenda.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // Plugin de visualização DayGrid
import timeGridPlugin from '@fullcalendar/timegrid'; // Plugin de visualização TimeGrid
import interactionPlugin from '@fullcalendar/interaction';
import { DashboardComponent } from './_pages/dashboard/dashboard.component';
import { ClienteChartsComponent } from './_components/cliente-charts/cliente-charts.component';
import { AgendamentoChartsComponent } from './_components/agendamento-charts/agendamento-charts.component';
import { GeneroChartsComponent } from './_components/genero-charts/genero-charts.component'; // Plugin para 
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MainLayoutComponent } from './main-layout/main-layout.component'; 
import { LoginComponent } from './_pages/login/login.component';
import { MenuMobileComponent } from './_components/menu-mobile/menu-mobile.component';
import { LandinPageComponent } from './landin-page/landin-page.component';
import { HeaderLPComponent } from './landin-page/components/header-lp/header-lp.component';
import { HeroLpComponent } from './landin-page/components/hero-lp/hero-lp.component';
import { BeneficiosLPComponent } from './landin-page/components/beneficios-lp/beneficios-lp.component';
import { ListarBancoComponent } from './_pages/banco/listar-banco/listar-banco.component';
import { ModalBancoComponent } from './_pages/banco/modal-banco/modal-banco.component';
import { ListarCentroDeCustoComponent } from './_pages/centroDeCusto/listar-centro-de-custo/listar-centro-de-custo.component';
import { ModalCentroDeCustoComponent } from './_pages/centroDeCusto/modal-centro-de-custo/modal-centro-de-custo.component';
import { ModalSubCentroDeCustoComponent } from './_pages/subCentroDeCusto/modal-sub-centro-de-custo/modal-sub-centro-de-custo.component';
import { ListarSubCentroDeCustoComponent } from './_pages/subCentroDeCusto/listar-sub-centro-de-custo/listar-sub-centro-de-custo.component';




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
    ModalConvenioComponent,
    ListarConvenioComponent,
    TabelaListarGenericaComponent,
    ListarConselhoComponent,
    ModalConselhoComponent,
    AgendaComponent,
    DashboardComponent,
    ClienteChartsComponent,
    AgendamentoChartsComponent,
    GeneroChartsComponent,
    MainLayoutComponent,
    LoginComponent,
    MenuMobileComponent,
    LandinPageComponent,
    HeaderLPComponent,
    HeroLpComponent,
    BeneficiosLPComponent,
    ListarBancoComponent,
    ModalBancoComponent,
    ListarCentroDeCustoComponent,
    ModalCentroDeCustoComponent,
    ModalSubCentroDeCustoComponent,
    ListarSubCentroDeCustoComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxMaskDirective,
    FullCalendarModule,
    NgxChartsModule,
    FormsModule     
    
  ],
  providers: [ provideNgxMask(),],
  bootstrap: [AppComponent]
})
export class AppModule { }
