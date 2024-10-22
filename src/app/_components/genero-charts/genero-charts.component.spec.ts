import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneroChartsComponent } from './genero-charts.component';

describe('GeneroChartsComponent', () => {
  let component: GeneroChartsComponent;
  let fixture: ComponentFixture<GeneroChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneroChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneroChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
