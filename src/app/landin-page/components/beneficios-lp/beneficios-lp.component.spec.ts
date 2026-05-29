import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosLPComponent } from './beneficios-lp.component';
import { CardBeneficiosComponent } from '../card-beneficios/card-beneficios.component';

describe('BeneficiosLPComponent', () => {
  let component: BeneficiosLPComponent;
  let fixture: ComponentFixture<BeneficiosLPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeneficiosLPComponent, CardBeneficiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiosLPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
