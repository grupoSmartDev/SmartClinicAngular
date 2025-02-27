import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaixaFinancReceberSubComponent } from './baixa-financ-receber-sub.component';

describe('BaixaFinancReceberSubComponent', () => {
  let component: BaixaFinancReceberSubComponent;
  let fixture: ComponentFixture<BaixaFinancReceberSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaixaFinancReceberSubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaixaFinancReceberSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
