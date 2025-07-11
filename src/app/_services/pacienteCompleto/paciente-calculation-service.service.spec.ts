import { TestBed } from '@angular/core/testing';

import { PacienteCalculationServiceService } from './paciente-calculation-service.service';

describe('PacienteCalculationServiceService', () => {
  let service: PacienteCalculationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacienteCalculationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
