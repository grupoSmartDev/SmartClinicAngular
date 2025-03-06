import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegundaDobraComponent } from './segunda-dobra.component';

describe('SegundaDobraComponent', () => {
  let component: SegundaDobraComponent;
  let fixture: ComponentFixture<SegundaDobraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SegundaDobraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SegundaDobraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
