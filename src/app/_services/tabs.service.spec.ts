import { Router } from '@angular/router';

import { TabService } from './tabs.service';

describe('TabService', () => {
  let service: TabService;

  beforeEach(() => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    service = new TabService(router);
  });

  it('deve limpar somente as entradas que correspondem ao prefixo informado', () => {
    service.setCacheData('paciente-list-1-10----true', { pagina: 1 });
    service.setCacheData('paciente-list-2-10----true', { pagina: 2 });
    service.setCacheData('paciente-list-1-10-Maria---true', { filtro: 'Maria' });
    service.setCacheData('agenda-list-1-10', { pagina: 1 });

    service.clearCacheByPrefix('paciente-list-');

    expect(service.getCacheData('paciente-list-1-10----true')).toBeUndefined();
    expect(service.getCacheData('paciente-list-2-10----true')).toBeUndefined();
    expect(service.getCacheData('paciente-list-1-10-Maria---true')).toBeUndefined();
    expect(service.getCacheData('agenda-list-1-10')).toEqual({ pagina: 1 });
  });
});
