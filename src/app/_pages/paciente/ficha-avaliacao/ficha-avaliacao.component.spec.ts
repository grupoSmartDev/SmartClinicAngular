import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAvaliacaoComponent } from './ficha-avaliacao.component';

describe('FichaAvaliacaoComponent', () => {
  let component: FichaAvaliacaoComponent;
  let fixture: ComponentFixture<FichaAvaliacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FichaAvaliacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAvaliacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
