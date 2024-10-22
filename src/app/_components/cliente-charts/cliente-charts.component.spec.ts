import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteChartsComponent } from './cliente-charts.component';

describe('ClienteChartsComponent', () => {
  let component: ClienteChartsComponent;
  let fixture: ComponentFixture<ClienteChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClienteChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
