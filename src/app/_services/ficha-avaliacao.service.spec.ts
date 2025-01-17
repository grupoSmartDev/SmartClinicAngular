import { TestBed } from '@angular/core/testing';

import { FichaAvaliacaoService } from './ficha-avaliacao.service';

describe('FichaAvaliacaoService', () => {
  let service: FichaAvaliacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichaAvaliacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
