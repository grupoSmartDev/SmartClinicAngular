import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroRapidoPacienteComponent } from './cadastro-rapido-paciente.component';

describe('CadastroRapidoPacienteComponent', () => {
  let component: CadastroRapidoPacienteComponent;
  let fixture: ComponentFixture<CadastroRapidoPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CadastroRapidoPacienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroRapidoPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
