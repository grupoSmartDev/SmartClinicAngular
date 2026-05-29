import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformSolucaoComponent } from './inform-solucao.component';
import { CardBeneficiosComponent } from '../card-beneficios/card-beneficios.component';

describe('InformSolucaoComponent', () => {
  let component: InformSolucaoComponent;
  let fixture: ComponentFixture<InformSolucaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformSolucaoComponent, CardBeneficiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformSolucaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
