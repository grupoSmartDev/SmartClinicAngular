import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './_pages/status/listar/listar.component';
import { ListarTipoPagamentoComponent } from './_pages/tipoPagamento/listar-tipo-pagamento/listar-tipo-pagamento.component';
import { ListarFormaPagamentoComponent } from './_pages/formaPagamento/listar-forma-pagamento/listar-forma-pagamento.component';
import { ListarFornecedorComponent } from './_pages/fornecedor/listar-fornecedor/listar-fornecedor.component';
import { ListarSalasComponent } from './_pages/sala/listar-salas/listar-salas.component';

const routes: Routes = [
  {path:'', component: ListarComponent},
  {path:'status/listar', component: ListarComponent},
  {path:'tipoPagamento/listar', component: ListarTipoPagamentoComponent},
  {path:'formaPagamento/listar', component: ListarFormaPagamentoComponent},
  {path:'fornecedor/listar', component: ListarFornecedorComponent},
  {path:'sala/listar', component: ListarSalasComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
