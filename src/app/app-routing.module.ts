import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './_pages/status/listar/listar.component';
import { ListarTipoPagamentoComponent } from './_pages/tipoPagamento/listar-tipo-pagamento/listar-tipo-pagamento.component';
import { ListarFormaPagamentoComponent } from './_pages/formaPagamento/listar-forma-pagamento/listar-forma-pagamento.component';
import { ListarFornecedorComponent } from './_pages/fornecedor/listar-fornecedor/listar-fornecedor.component';
import { ListarSalasComponent } from './_pages/sala/listar-salas/listar-salas.component';
import { ListarConvenioComponent } from './_pages/convenio/listar-convenio/listar-convenio.component';
import { ListarConselhoComponent } from './_pages/conselho/listar-conselho/listar-conselho.component';
import { AgendaComponent } from './_pages/agenda/agenda.component';
import { DashboardComponent } from './_pages/dashboard/dashboard.component';
import { LoginComponent } from './_pages/login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LandinPageComponent } from './landin-page/landin-page.component';
import { ListarBancoComponent } from './_pages/banco/listar-banco/listar-banco.component';
import { ListarCentroDeCustoComponent } from './_pages/centroDeCusto/listar-centro-de-custo/listar-centro-de-custo.component';
import { ListarSubCentroDeCustoComponent } from './_pages/subCentroDeCusto/listar-sub-centro-de-custo/listar-sub-centro-de-custo.component';
import { ListarProfissionalComponent } from './_pages/profissional/listar-profissional/listar-profissional.component';
import { ListarPacienteComponent } from './_pages/paciente/listar-paciente/listar-paciente.component';
import { ListarLogComponent } from './_pages/log/listar-log/listar-log.component';
import { PacienteCompletoComponent } from './_pages/paciente/paciente-completo/paciente-completo.component';
import { ListarUsuarioComponent } from './_pages/usuario/listar-usuario/listar-usuario.component';
import { TesteRelacionamentoComponent } from './_pages/teste-relacionamento/teste-relacionamento.component';
import { TesteNovosComponentsComponent } from './_pages/teste-novos-components/teste-novos-components.component';
import { ListarExerciciosComponent } from './_pages/exercicios/listar-exercicios/listar-exercicios.component';
import { ListaAtividadeComponent } from './_pages/atividade/lista-atividade/lista-atividade.component';
import { ListarPlanosComponent } from './_pages/planos/listar-planos/listar-planos.component';
import { ListaProcedimentoComponent } from './_pages/procedimento/lista-procedimento/lista-procedimento.component';
import { ListarCategoriaComponent } from './_pages/categoria/listar-categoria/listar-categoria.component';
import { ListarFinancReceberComponent } from './_pages/financReceber/listar-financ-receber/listar-financ-receber.component';
import { ListarFinancPagarComponent } from './_pages/financPagar/listar-financ-pagar/listar-financ-pagar.component';
import { ListarProfissaoComponent } from './_pages/profissao/listar-profissao/listar-profissao.component';
import { ListarPlanoContasSubComponent } from './_pages/planoContasSub/listar-plano-contas-sub/listar-plano-contas-sub.component';
import { ListarPlanoContasComponent } from './_pages/planoContas/listar-plano-contas/listar-plano-contas.component';
import { AuthGuard } from './auth.guard';
import { ListarReceberSinteticoComponent } from './_pages/financReceber/listar-receber-sintetico/listar-receber-sintetico.component';
import { ListarPagarSinteticoComponent } from './_pages/financPagar/listar-pagar-sintetico/listar-pagar-sintetico.component';
import { ListarDespesaComponent } from './_pages/despesaFixa/listar-despesa/listar-despesa.component';
import { PaginaCadastroComponent } from './cadastro-page/pagina-cadastro/pagina-cadastro.component';
import { ConfiguracoesComponent } from './_pages/configuracoes/configuracoes.component';
import { AlterarDadosUsuarioComponent } from './_pages/configuracoes/alterar-dados-usuario/alterar-dados-usuario.component';
import { AgendaListarComponent } from './_pages/agenda/agenda-listar/agenda-listar.component';
import { ListarComissoesComponent } from './_pages/comissao/listar-comissoes/listar-comissoes.component';
import { UpgradeComponent } from './_pages/upgrade/upgrade/upgrade.component';
import { ListarPacoteComponent } from './_pages/pacote/listar-pacote/listar-pacote.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Rota para a página de login
  { path: 'lp', component: LandinPageComponent },
  { path: 'cadastro', component: PaginaCadastroComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], // ← APLICADO AQUI para proteger todas as rotas filhas
    children: [
      { path: '', component: DashboardComponent }, // Página inicial protegida
      { path: 'status/listar', component: ListarComponent },
      { path: 'tipoPagamento/listar', component: ListarTipoPagamentoComponent },
      {
        path: 'formaPagamento/listar',
        component: ListarFormaPagamentoComponent,
      },
      { path: 'fornecedor/listar', component: ListarFornecedorComponent },
      { path: 'sala/listar', component: ListarSalasComponent },
      { path: 'convenio/listar', component: ListarConvenioComponent },
      { path: 'conselho/listar', component: ListarConselhoComponent },
      { path: 'agenda/listar', component: AgendaListarComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'banco/listar', component: ListarBancoComponent },
      { path: 'centroDeCusto/listar', component: ListarCentroDeCustoComponent },
      {
        path: 'SubcentroDeCusto/listar',
        component: ListarSubCentroDeCustoComponent,
      },
      { path: 'profissional/listar', component: ListarProfissionalComponent },
      { path: 'pacientes/listar', component: ListarPacienteComponent },
      { path: 'pacientes/listar/:id', component: ListarPacienteComponent },
      { path: 'log/listar', component: ListarLogComponent },
      { path: 'paciente/:id', component: PacienteCompletoComponent },
      { path: 'usuario/listar', component: ListarUsuarioComponent },
      { path: 'teste', component: TesteRelacionamentoComponent },
      { path: 'testeComponents', component: TesteNovosComponentsComponent },
      { path: 'exercicio/listar', component: ListarExerciciosComponent },
      { path: 'atividade/listar', component: ListaAtividadeComponent },
      { path: 'plano/listar', component: ListarPlanosComponent },
      { path: 'procedimento/listar', component: ListaProcedimentoComponent },
      { path: 'categoria/listar', component: ListarCategoriaComponent },
      {
        path: 'FinancReceber/listarAnalitico',
        component: ListarFinancReceberComponent,
      },
      {
        path: 'FinancReceber/listarSintetico',
        component: ListarReceberSinteticoComponent,
      },
      {
        path: 'FinancPagar/listarAnalitico',
        component: ListarFinancPagarComponent,
      },
      {
        path: 'FinancPagar/listarSintetico',
        component: ListarPagarSinteticoComponent,
      },
      { path: 'profissao/listar', component: ListarProfissaoComponent },
      { path: 'pacote/listar', component: ListarPacoteComponent },
      { path: 'planoContas/listar', component: ListarPlanoContasComponent },
      {
        path: 'planoContaSub/listar',
        component: ListarPlanoContasSubComponent,
      },
      { path: 'DespesasFixa/ListarDespesa', component: ListarDespesaComponent },
      { path: 'Configuracoes/alterarDadosUsuario', component: AlterarDadosUsuarioComponent },
      { path: 'Comissoes/Listar', component: ListarComissoesComponent },
      { path: 'upgrade', component: UpgradeComponent },
    ],
  },

  { path: '**', redirectTo: 'login' }, // Redireciona para login caso a rota não seja encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }