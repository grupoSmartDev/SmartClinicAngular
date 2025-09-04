import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { PessoaFisicaFormComponent } from './_pages/fornecedor/pessoa-fisica-form/pessoa-fisica-form.component';
import { PessoaJuridicaFormComponent } from './_pages/fornecedor/pessoa-juridica-form/pessoa-juridica-form.component';
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
import { AgendamentoChartsComponent } from './_components/agendamento-charts/agendamento-charts.component';
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
import { DatePtBrPipe } from './_shared/pipes/date-pt-br.pipe';
import { CurrencyPtBrPipe } from './_shared/pipes/currency-pt-br.pipe';
import { CalendarComponent } from './_components/_calendar/calendar/calendar.component';
import { CalendarModule } from './calendar/calendar.module';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthInterceptor } from './auth.interceptor';
import { OnlyNumbersDirective } from './_shared/pipes/only-number.directive';
import { NgxSpinnerModule } from "ngx-spinner";
import { FichaAvaliacaoComponent } from './_pages/paciente/ficha-avaliacao/ficha-avaliacao.component';
import { MenuComponent } from './_components/menu/menu.component';
import { CadastroRapidoPacienteComponent } from './_components/cadastro-rapido-paciente/cadastro-rapido-paciente.component';
import { HistoricoPlanoComponent } from './_pages/paciente/historico-plano/historico-plano.component';
import { ListarReceberSinteticoComponent } from './_pages/financReceber/listar-receber-sintetico/listar-receber-sintetico.component';
import { BaixaFinancReceberSubComponent } from './_components/baixa-financ-receber-sub/baixa-financ-receber-sub.component';
import { ListarPagarSinteticoComponent } from './_pages/financPagar/listar-pagar-sintetico/listar-pagar-sintetico.component';
import { BaixaFinancPagarSubComponent } from './_components/baixa-financ-pagar-sub/baixa-financ-pagar-sub.component';
import { TelefonePipePipe } from './_shared/pipes/telefone-pipe.pipe';
import { HeroComponent } from './_lp/components/hero/hero.component';
import { SegundaDobraComponent } from './_lp/components/segunda-dobra/segunda-dobra.component';
import { TerceiraDobraComponent } from './_lp/components/terceira-dobra/terceira-dobra.component';
import { QuartaDobraComponent } from './_lp/components/quarta-dobra/quarta-dobra.component';
import { QuintaDobraComponent } from './_lp/components/quinta-dobra/quinta-dobra.component';
import { SextaDobraComponent } from './_lp/components/sexta-dobra/sexta-dobra.component';
import { FacDobraComponent } from './_lp/components/fac-dobra/fac-dobra.component';
import { PriceComponent } from './_lp/components/price/price.component';
import { CalendarioComponent } from './_components/calendario/calendario.component';
import { ListarDespesaComponent } from './_pages/despesaFixa/listar-despesa/listar-despesa.component';
import { ModalDespesaComponent } from './_pages/despesaFixa/modal-despesa/modal-despesa.component';
import { PaginaCadastroComponent } from './cadastro-page/pagina-cadastro/pagina-cadastro.component';
import { ConfiguracoesComponent } from './_pages/configuracoes/configuracoes.component';
import { AlterarDadosUsuarioComponent } from './_pages/configuracoes/alterar-dados-usuario/alterar-dados-usuario.component';
import { AgendaListarComponent } from './_pages/agenda/agenda-listar/agenda-listar.component';
import { ButtonActionComponent } from './_components/button-action/button-action.component';
import { SelectBancoComponent } from './_components/select-banco/select-banco.component';
import { PaymentComponent } from './_components/payment/payment.component';
import { PacienteEvolucaoDialogComponent } from './_pages/paciente/paciente-completo/dialogs/paciente-evolucao-dialog/paciente-evolucao-dialog.component';
import { PacientePlanoDialogComponent } from './_pages/paciente/paciente-completo/dialogs/paciente-plano-dialog/paciente-plano-dialog.component';
import { PacientePlanoRenovacaoDialogComponent } from './_pages/paciente/paciente-completo/dialogs/paciente-plano-renovacao-dialog/paciente-plano-renovacao-dialog.component';
import { PacienteDetailsComponent } from './_pages/paciente/paciente-completo/paciente-details/paciente-details.component';
import { BtnWppFloatComponent } from './_components/btn-wpp-float/btn-wpp-float.component';
import { LettersDirective } from './_shared/pipes/letters.directive';
import { DialogAtivarComponent } from './_components/dialog-ativar/dialog-ativar.component';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ListarComissoesComponent } from './_pages/comissao/listar-comissoes/listar-comissoes.component';

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
    PessoaFisicaFormComponent,
    PessoaJuridicaFormComponent,
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
    AgendamentoChartsComponent,
    MainLayoutComponent,
    LoginComponent,
    MenuComponent,
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
    ModalPlanoContasSubComponent,
    DatePtBrPipe,
    CurrencyPtBrPipe,
    OnlyNumbersDirective,
    FichaAvaliacaoComponent,
    MenuComponent,
    CadastroRapidoPacienteComponent,
    HistoricoPlanoComponent,
    ListarReceberSinteticoComponent,
    BaixaFinancReceberSubComponent,
    ListarPagarSinteticoComponent,
    BaixaFinancPagarSubComponent,
    TelefonePipePipe,
    HeroComponent,
    SegundaDobraComponent,
    TerceiraDobraComponent,
    QuartaDobraComponent,
    QuintaDobraComponent,
    SextaDobraComponent,
    FacDobraComponent,
    PriceComponent,
    CalendarioComponent,
    ListarDespesaComponent,
    ModalDespesaComponent,
    PaginaCadastroComponent,
    ConfiguracoesComponent,
    AlterarDadosUsuarioComponent,
    AgendaListarComponent,
    ButtonActionComponent,
    SelectBancoComponent,
    PaymentComponent,
    PacienteEvolucaoDialogComponent,
    PacientePlanoDialogComponent,
    PacientePlanoRenovacaoDialogComponent,
    PacienteDetailsComponent,
    BtnWppFloatComponent,
    LettersDirective,
    DialogAtivarComponent,
    ListarComissoesComponent,
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
    NgxCurrencyDirective ,
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    CalendarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        allowedDomains: ['localhost:44308'], // domínio onde sua API está rodando
        disallowedRoutes: ['localhost:44308/Auth/login', 'localhost:44308/CadastroCliente/Criar', 'localhost:4200/CadastroCliente/Criar', 'http://localhost:4200/cadastro'] // rota de login que não precisa do token
      }
    }),
    NgxSpinnerModule.forRoot({ type: 'square-jelly-box' })
  ],
  providers: [provideNgxMask(), {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }