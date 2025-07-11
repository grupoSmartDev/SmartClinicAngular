import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientePlanoRenovacaoDialogComponent } from './paciente-plano-renovacao-dialog.component';

describe('PacientePlanoRenovacaoDialogComponent', () => {
  let component: PacientePlanoRenovacaoDialogComponent;
  let fixture: ComponentFixture<PacientePlanoRenovacaoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacientePlanoRenovacaoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientePlanoRenovacaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
