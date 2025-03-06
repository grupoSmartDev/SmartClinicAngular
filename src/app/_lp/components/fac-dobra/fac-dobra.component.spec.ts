import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacDobraComponent } from './fac-dobra.component';

describe('FacDobraComponent', () => {
  let component: FacDobraComponent;
  let fixture: ComponentFixture<FacDobraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacDobraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacDobraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
