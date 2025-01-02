import { TestBed } from '@angular/core/testing';

import { PlanoContasSubService } from './plano-contas-sub.service';

describe('PlanoContasSubService', () => {
  let service: PlanoContasSubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanoContasSubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
