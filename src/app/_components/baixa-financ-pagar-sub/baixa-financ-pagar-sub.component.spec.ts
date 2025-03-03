import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaixaFinancPagarSubComponent } from './baixa-financ-pagar-sub.component';

describe('BaixaFinancPagarSubComponent', () => {
  let component: BaixaFinancPagarSubComponent;
  let fixture: ComponentFixture<BaixaFinancPagarSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaixaFinancPagarSubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaixaFinancPagarSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
