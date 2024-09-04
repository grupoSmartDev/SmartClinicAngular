import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './_pages/status/listar/listar.component';

const routes: Routes = [
  {path:'', component: ListarComponent},
  {path:'status/listar', component: ListarComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
