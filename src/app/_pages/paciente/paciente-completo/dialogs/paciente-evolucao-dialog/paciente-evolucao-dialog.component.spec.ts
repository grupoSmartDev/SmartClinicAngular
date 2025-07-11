import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEvolucaoDialogComponent } from './paciente-evolucao-dialog.component';

describe('PacienteEvolucaoDialogComponent', () => {
  let component: PacienteEvolucaoDialogComponent;
  let fixture: ComponentFixture<PacienteEvolucaoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacienteEvolucaoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteEvolucaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
