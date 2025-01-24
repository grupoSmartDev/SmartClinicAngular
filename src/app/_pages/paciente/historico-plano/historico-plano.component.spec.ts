import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoPlanoComponent } from './historico-plano.component';

describe('HistoricoPlanoComponent', () => {
  let component: HistoricoPlanoComponent;
  let fixture: ComponentFixture<HistoricoPlanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoricoPlanoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoPlanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
