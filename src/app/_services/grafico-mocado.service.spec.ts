import { TestBed } from '@angular/core/testing';

import { GraficoMocadoService } from './grafico-mocado.service';

describe('GraficoMocadoService', () => {
  let service: GraficoMocadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraficoMocadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
