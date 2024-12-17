import { TestBed } from '@angular/core/testing';

import { ProfissaoService } from './profissao.service';

describe('ProfissaoService', () => {
  let service: ProfissaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
