import { TestBed } from '@angular/core/testing';

import { PacienteDialogServiceService } from './paciente-dialog-service.service';

describe('PacienteDialogServiceService', () => {
  let service: PacienteDialogServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PacienteDialogServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
