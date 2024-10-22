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

const routes: Routes = [
  {path:'', component: DashboardComponent},
  {path:'status/listar', component: ListarComponent},
  {path:'tipoPagamento/listar', component: ListarTipoPagamentoComponent},
  {path:'formaPagamento/listar', component: ListarFormaPagamentoComponent},
  {path:'fornecedor/listar', component: ListarFornecedorComponent},
  {path:'sala/listar', component: ListarSalasComponent},
  {path:'convenio/listar', component: ListarConvenioComponent},
  {path:'conselho/listar', component: ListarConselhoComponent},
  {path:'agenda/listar', component: AgendaComponent},
  {path:'dashboard', component: DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
