import { TestBed } from '@angular/core/testing';

import { EvolucaoService } from './evolucao.service';

describe('EvolucaoService', () => {
  let service: EvolucaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvolucaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
