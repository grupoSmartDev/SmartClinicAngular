import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDespesaComponent } from './modal-despesa.component';

describe('ModalDespesaComponent', () => {
  let component: ModalDespesaComponent;
  let fixture: ComponentFixture<ModalDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDespesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
