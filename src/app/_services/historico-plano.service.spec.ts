import { TestBed } from '@angular/core/testing';

import { HistoricoPlanoService } from './historico-plano.service';

describe('HistoricoPlanoService', () => {
  let service: HistoricoPlanoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoPlanoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
