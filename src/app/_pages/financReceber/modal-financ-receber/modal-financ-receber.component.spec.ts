import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFinanceiroReceber  } from './modal-financ-receber.component';

describe('ModalFinancReceberComponent', () => {
  let component: ModalFinanceiroReceber ;
  let fixture: ComponentFixture<ModalFinanceiroReceber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFinanceiroReceber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFinanceiroReceber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
