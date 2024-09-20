import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTipoPagamentoComponent } from './listar-tipo-pagamento.component';

describe('ListarTipoPagamentoComponent', () => {
  let component: ListarTipoPagamentoComponent;
  let fixture: ComponentFixture<ListarTipoPagamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarTipoPagamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarTipoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
