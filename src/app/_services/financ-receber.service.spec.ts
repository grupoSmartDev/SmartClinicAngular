import { TestBed } from '@angular/core/testing';

import { FinancReceberService } from './financ-receber.service';

describe('FinancReceberService', () => {
  let service: FinancReceberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancReceberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
