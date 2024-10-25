import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiosLPComponent } from './beneficios-lp.component';

describe('BeneficiosLPComponent', () => {
  let component: BeneficiosLPComponent;
  let fixture: ComponentFixture<BeneficiosLPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeneficiosLPComponent]
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
