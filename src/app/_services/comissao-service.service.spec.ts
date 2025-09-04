import { TestBed } from '@angular/core/testing';

import { ComissaoServiceService } from './comissao-service.service';

describe('ComissaoServiceService', () => {
  let service: ComissaoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComissaoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
