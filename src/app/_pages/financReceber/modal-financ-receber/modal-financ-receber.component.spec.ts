import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFinancReceberComponent } from './modal-financ-receber.component';

describe('ModalFinancReceberComponent', () => {
  let component: ModalFinancReceberComponent;
  let fixture: ComponentFixture<ModalFinancReceberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFinancReceberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFinancReceberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
