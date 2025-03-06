import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuartaDobraComponent } from './quarta-dobra.component';

describe('QuartaDobraComponent', () => {
  let component: QuartaDobraComponent;
  let fixture: ComponentFixture<QuartaDobraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuartaDobraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuartaDobraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
