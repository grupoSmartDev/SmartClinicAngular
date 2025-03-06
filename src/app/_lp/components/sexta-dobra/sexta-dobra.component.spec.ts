import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SextaDobraComponent } from './sexta-dobra.component';

describe('SextaDobraComponent', () => {
  let component: SextaDobraComponent;
  let fixture: ComponentFixture<SextaDobraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SextaDobraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SextaDobraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
