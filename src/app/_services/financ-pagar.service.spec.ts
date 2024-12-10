import { TestBed } from '@angular/core/testing';

import { FinancPagarService } from './financ-pagar.service';

describe('FinancPagarService', () => {
  let service: FinancPagarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancPagarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
