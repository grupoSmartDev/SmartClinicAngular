import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroLpComponent } from './hero-lp.component';

describe('HeroLpComponent', () => {
  let component: HeroLpComponent;
  let fixture: ComponentFixture<HeroLpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroLpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroLpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
