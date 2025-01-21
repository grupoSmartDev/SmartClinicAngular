import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conselho } from '../_module/conselhoModule';
import { ResponseModel } from '../_module/ResponseModule';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ConselhoService {

  constructor(private http: HttpClient) { }

  baseURL: string = environment.apiUrl + 'api/Conselho/';

  private mockConselhos: Conselho[] = Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
    nome: `Conselho ${i + 1}`,
    sigla: ''
  }));

  Listar(page: number, pageSize: number, nomeFiltro?: string, siglaFiltro?: string, idFiltro?: string, paginar: boolean = false): Observable<ResponseModel<Conselho[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (nomeFiltro) params = params.set('nomeFiltro', nomeFiltro);
    if (siglaFiltro) params = params.set('siglaFiltro', siglaFiltro);
    if (idFiltro) params = params.set('idFiltro', idFiltro);
    if (paginar) params = params.set('paginar', paginar);

    return this.http.get<ResponseModel<Conselho[]>>(`${this.baseURL}Listar`, { params });
  }

  ListarTeste(page: number, pageSize: number, nomeFiltro?: string): Observable<ResponseModel<Conselho[]>> {
    let filteredConselhos = this.mockConselhos;

    if (nomeFiltro) {
      filteredConselhos = filteredConselhos.filter(c => c.nome.toLowerCase().includes(nomeFiltro.toLowerCase()));
    }

    const totalCount = filteredConselhos.length;
    const paginatedConselhos = filteredConselhos.slice((page - 1) * pageSize, page * pageSize);

    const response: ResponseModel<Conselho[]> = {
      dados: paginatedConselhos,
      mensagem: 'Dados mockados retornados com sucesso.',
      status: true,
      totalCount,
      pageSize
    };

    return of(response);
  }


  Criar(conselho: Conselho): Observable<ResponseModel<Conselho>> {
    return this.http.post<ResponseModel<Conselho>>(`${this.baseURL}Criar`, conselho);
  }

  Atualizar(conselho: Conselho): Observable<ResponseModel<Conselho>> {
    return this.http.put<ResponseModel<Conselho>>(`${this.baseURL}Editar`, conselho);
  }

  Deletar(id: string): Observable<ResponseModel<void>> {
    return this.http.delete<ResponseModel<void>>(`${this.baseURL}Delete/${id}`);
  }
}
