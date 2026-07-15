import { of } from 'rxjs';

import { ListarPacienteComponent } from './listar-paciente.component';

describe('ListarPacienteComponent', () => {
  let component: ListarPacienteComponent;
  let pacienteService: jasmine.SpyObj<any>;
  let tabService: jasmine.SpyObj<any>;

  beforeEach(() => {
    pacienteService = jasmine.createSpyObj('PacienteService', ['Deletar', 'Listar']);
    tabService = jasmine.createSpyObj('TabService', [
      'clearCacheByPrefix',
      'getCacheData',
      'setCacheData'
    ]);

    component = new ListarPacienteComponent(
      pacienteService,
      jasmine.createSpyObj('ToastrService', ['success', 'error']),
      jasmine.createSpyObj('Router', ['navigate']),
      jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']),
      { snapshot: { paramMap: { get: () => null } } } as any,
      tabService
    );
  });

  it('deve invalidar todas as páginas e atualizar a página atual após salvar', () => {
    component.currentPage = 2;
    component.totalItems = 10;
    pacienteService.Listar.and.returnValue(of({
      dados: [{ id: 11, nome: 'Novo paciente' }],
      totalCount: 11
    }));

    component.atualizarLista();

    expect(tabService.clearCacheByPrefix).toHaveBeenCalledOnceWith('paciente-list-');
    expect(pacienteService.Listar).toHaveBeenCalledOnceWith(2, 10, '', '', '', '', true);
    expect(tabService.clearCacheByPrefix.calls.first().invocationOrder)
      .toBeLessThan(pacienteService.Listar.calls.first().invocationOrder);
    expect(component.currentPage).toBe(2);
    expect(component.lista).toEqual([jasmine.objectContaining({ id: 11 }) as any]);
    expect(component.totalItems).toBe(11);
  });

  it('deve invalidar todas as páginas e recarregar a atual após excluir', () => {
    pacienteService.Deletar.and.returnValue(of({ status: true }));
    spyOn(component, 'loadData');

    component.excluirPaciente({ id: 42 } as any);

    expect(pacienteService.Deletar).toHaveBeenCalledOnceWith('42');
    expect(tabService.clearCacheByPrefix).toHaveBeenCalledOnceWith('paciente-list-');
    expect(component.loadData).toHaveBeenCalledTimes(1);
  });
});
