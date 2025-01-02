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
import { ListarContasAPagarComponent } from './_pages/contasAPagar/listar-contas-apagar/listar-contas-apagar.component';
import { ModalContasAPagarComponent } from './_pages/contasAPagar/modal-contas-apagar/modal-contas-apagar.component';
import { ListarProfissionalComponent } from './_pages/profissional/listar-profissional/listar-profissional.component';
import { ModalProfissionalComponent } from './_pages/profissional/modal-profissional/modal-profissional.component';
import { CardDadosComponent } from './_components/card-dados/card-dados.component';
import { ListarPacienteComponent } from './_pages/paciente/listar-paciente/listar-paciente.component';
import { ModalPacienteComponent } from './_pages/paciente/modal-paciente/modal-paciente.component';
import { CardBeneficiosComponent } from './landin-page/components/card-beneficios/card-beneficios.component';
import { PerguntaDorComponent } from './landin-page/components/pergunta-dor/pergunta-dor.component';
import { DuvidasFaqComponent } from './landin-page/components/duvidas-faq/duvidas-faq.component';
import { DobraCobrancaComponent } from './landin-page/components/dobra-cobranca/dobra-cobranca.component';
import { InformSolucaoComponent } from './landin-page/components/inform-solucao/inform-solucao.component';
import { InformAgendaComponent } from './landin-page/components/inform-agenda/inform-agenda.component';
import { PrecosComponent } from './landin-page/components/precos/precos.component';
import { ListarLogComponent } from './_pages/log/listar-log/listar-log.component';
import { Precov0Component } from './landin-page/components/precov0/precov0.component';
import { PacienteCompletoComponent } from './_pages/paciente/paciente-completo/paciente-completo.component';
import { ListarUsuarioComponent } from './_pages/usuario/listar-usuario/listar-usuario.component';
import { ModalUsuarioComponent } from './_pages/usuario/modal-usuario/modal-usuario.component';
import { ModalAgendaComponent } from './_pages/agenda/modal-agenda/modal-agenda.component';
import { CommonModule } from '@angular/common';
import { ModalExercicioComponent } from './_pages/exercicios/modal-exercicio/modal-exercicio.component';
import { ListarExerciciosComponent } from './_pages/exercicios/listar-exercicios/listar-exercicios.component';
import { TesteRelacionamentoComponent } from './_pages/teste-relacionamento/teste-relacionamento.component';
import { TesteNovosComponentsComponent } from './_pages/teste-novos-components/teste-novos-components.component';
import { ListaAtividadeComponent } from './_pages/atividade/lista-atividade/lista-atividade.component';
import { ModalAtividadeComponent } from './_pages/atividade/modal-atividade/modal-atividade.component';
import { ListarPlanosComponent } from './_pages/planos/listar-planos/listar-planos.component';
import { ModalPlanosComponent } from './_pages/planos/modal-planos/modal-planos.component';
import { ModalProcedimentoComponent } from './_pages/procedimento/modal-procedimento/modal-procedimento.component';
import { ListarCategoriaComponent } from './_pages/categoria/listar-categoria/listar-categoria.component';
import { ModalCategoriaComponent } from './_pages/categoria/modal-categoria/modal-categoria.component';
import { ListaProcedimentoComponent } from './_pages/procedimento/lista-procedimento/lista-procedimento.component';
import { ListarFinancReceberComponent } from './_pages/financReceber/listar-financ-receber/listar-financ-receber.component';
import { ModalFinanceiroReceber } from './_pages/financReceber/modal-financ-receber/modal-financ-receber.component';
import { ListarFinancPagarComponent } from './_pages/financPagar/listar-financ-pagar/listar-financ-pagar.component';
import { ModalFinancPagarComponent } from './_pages/financPagar/modal-financ-pagar/modal-financ-pagar.component';
import { ListarProfissaoComponent } from './_pages/profissao/listar-profissao/listar-profissao.component';
import { ModalProfissaoComponent } from './_pages/profissao/modal-profissao/modal-profissao.component';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ListarPlanoContasComponent } from './_pages/planoContas/listar-plano-contas/listar-plano-contas.component';
import { ModalPlanoContasComponent } from './_pages/planoContas/modal-plano-contas/modal-plano-contas.component';
import { ListarPlanoContasSubComponent } from './_pages/planoContasSub/listar-plano-contas-sub/listar-plano-contas-sub.component';
import { ModalPlanoContasSubComponent } from './_pages/planoContasSub/modal-plano-contas-sub/modal-plano-contas-sub.component';






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
    ListarSubCentroDeCustoComponent,
    ListarContasAPagarComponent,
    ModalContasAPagarComponent,
    ListarProfissionalComponent,
    ModalProfissionalComponent,
    CardDadosComponent,
    ListarPacienteComponent,
    ModalPacienteComponent,
    CardBeneficiosComponent,
    PerguntaDorComponent,
    DuvidasFaqComponent,
    DobraCobrancaComponent,
    InformSolucaoComponent,
    InformAgendaComponent,
    PrecosComponent,
    ListarLogComponent,
    Precov0Component,
    PacienteCompletoComponent,
    ListarUsuarioComponent,
    ModalUsuarioComponent,
    ModalAgendaComponent,
    ListarExerciciosComponent,
    ModalExercicioComponent,
    TesteRelacionamentoComponent,
    TesteNovosComponentsComponent,
    ListaAtividadeComponent,
    ModalAtividadeComponent,
    ListarPlanosComponent,
    ModalPlanosComponent,
    ModalProcedimentoComponent,
    ListarCategoriaComponent,
    ModalCategoriaComponent,
    ListaProcedimentoComponent,
    ListarFinancReceberComponent,
    ModalFinanceiroReceber,
    ListarFinancPagarComponent,
    ModalFinancPagarComponent,
    ModalProfissaoComponent,
    ListarProfissaoComponent,
    ListarPlanoContasComponent,
    ModalPlanoContasComponent,
    ListarPlanoContasSubComponent,
    ModalPlanoContasSubComponent
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
    FormsModule,    
    CommonModule,
    PaginationModule.forRoot()
    
  ],
  providers: [ provideNgxMask(),],
  bootstrap: [AppComponent]
})
export class AppModule { }
