import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Precov0Component } from './precov0.component';

describe('Precov0Component', () => {
  let component: Precov0Component;
  let fixture: ComponentFixture<Precov0Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Precov0Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Precov0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
