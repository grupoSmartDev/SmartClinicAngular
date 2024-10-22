import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentoChartsComponent } from './agendamento-charts.component';

describe('AgendamentoChartsComponent', () => {
  let component: AgendamentoChartsComponent;
  let fixture: ComponentFixture<AgendamentoChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendamentoChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendamentoChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
