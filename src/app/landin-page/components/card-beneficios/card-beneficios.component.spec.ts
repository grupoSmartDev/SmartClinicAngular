import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBeneficiosComponent } from './card-beneficios.component';

describe('CardBeneficiosComponent', () => {
  let component: CardBeneficiosComponent;
  let fixture: ComponentFixture<CardBeneficiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardBeneficiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBeneficiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
