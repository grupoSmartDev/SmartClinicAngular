import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnWppFloatComponent } from './btn-wpp-float.component';

describe('BtnWppFloatComponent', () => {
  let component: BtnWppFloatComponent;
  let fixture: ComponentFixture<BtnWppFloatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BtnWppFloatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnWppFloatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
