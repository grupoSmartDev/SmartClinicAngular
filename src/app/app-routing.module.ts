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
import { MainLayoutComponent } from './main-layout/main-layout.component'; // Importa o novo layout
import { LandinPageComponent } from './landin-page/landin-page.component';
import { ListarBancoComponent } from './_pages/banco/listar-banco/listar-banco.component';
import { ListarCentroDeCustoComponent } from './_pages/centroDeCusto/listar-centro-de-custo/listar-centro-de-custo.component';
import { ListarSubCentroDeCustoComponent } from './_pages/subCentroDeCusto/listar-sub-centro-de-custo/listar-sub-centro-de-custo.component';
import { ListarProfissionalComponent } from './_pages/profissional/listar-profissional/listar-profissional.component';
import { ListarPacienteComponent } from './_pages/paciente/listar-paciente/listar-paciente.component';
import { ListarLogComponent } from './_pages/log/listar-log/listar-log.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Rota para a página de login
  {path:'lp', component: LandinPageComponent},

  {
    path: '', component: MainLayoutComponent, // Usa o MainLayoutComponent como pai
    children: [
      { path: '', component: DashboardComponent }, // Página inicial
      { path: 'status/listar', component: ListarComponent },
      { path: 'tipoPagamento/listar', component: ListarTipoPagamentoComponent },
      { path: 'formaPagamento/listar', component: ListarFormaPagamentoComponent },
      { path: 'fornecedor/listar', component: ListarFornecedorComponent },
      { path: 'sala/listar', component: ListarSalasComponent },
      { path: 'convenio/listar', component: ListarConvenioComponent },
      { path: 'conselho/listar', component: ListarConselhoComponent },
      { path: 'agenda/listar', component: AgendaComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'banco/listar', component: ListarBancoComponent },
      { path: 'centroDeCusto/listar', component: ListarCentroDeCustoComponent },
      { path: 'SubcentroDeCusto/listar', component: ListarSubCentroDeCustoComponent },
      { path: 'profissional/listar', component: ListarProfissionalComponent },
      { path: 'pacientes/listar', component: ListarPacienteComponent },
      { path: 'log/listar', component: ListarLogComponent },
    ]
  },

  { path: '**', redirectTo: 'login' } // Redireciona para login caso a rota não seja encontrada
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
