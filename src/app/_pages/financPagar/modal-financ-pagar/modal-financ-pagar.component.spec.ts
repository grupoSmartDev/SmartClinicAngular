import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFinancPagarComponent } from './modal-financ-pagar.component';

describe('ModalFinancPagarComponent', () => {
  let component: ModalFinancPagarComponent;
  let fixture: ComponentFixture<ModalFinancPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFinancPagarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFinancPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
