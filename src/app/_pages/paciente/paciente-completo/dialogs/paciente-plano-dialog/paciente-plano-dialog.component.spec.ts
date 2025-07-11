import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientePlanoDialogComponent } from './paciente-plano-dialog.component';

describe('PacientePlanoDialogComponent', () => {
  let component: PacientePlanoDialogComponent;
  let fixture: ComponentFixture<PacientePlanoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacientePlanoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientePlanoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
