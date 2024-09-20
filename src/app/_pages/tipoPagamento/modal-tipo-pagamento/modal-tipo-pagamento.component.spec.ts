import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTipoPagamentoComponent } from './modal-tipo-pagamento.component';

describe('ModalTipoPagamentoComponent', () => {
  let component: ModalTipoPagamentoComponent;
  let fixture: ComponentFixture<ModalTipoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTipoPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTipoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
