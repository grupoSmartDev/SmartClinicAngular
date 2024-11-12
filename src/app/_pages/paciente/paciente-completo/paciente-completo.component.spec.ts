import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteCompletoComponent } from './paciente-completo.component';

describe('PacienteCompletoComponent', () => {
  let component: PacienteCompletoComponent;
  let fixture: ComponentFixture<PacienteCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacienteCompletoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
