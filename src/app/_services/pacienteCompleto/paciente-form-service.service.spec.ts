import { TestBed } from '@angular/core/testing';

import { PacienteFormServiceService } from './paciente-form-service.service';

describe('PacienteFormServiceService', () => {
  let service: PacienteFormServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacienteFormServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
