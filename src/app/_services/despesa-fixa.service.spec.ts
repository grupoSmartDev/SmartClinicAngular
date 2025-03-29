import { TestBed } from '@angular/core/testing';

import { DespesaFixaService } from './despesa-fixa.service';

describe('DespesaFixaService', () => {
  let service: DespesaFixaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DespesaFixaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
