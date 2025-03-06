import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuintaDobraComponent } from './quinta-dobra.component';

describe('QuintaDobraComponent', () => {
  let component: QuintaDobraComponent;
  let fixture: ComponentFixture<QuintaDobraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuintaDobraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuintaDobraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
