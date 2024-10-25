import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLPComponent } from './header-lp.component';

describe('HeaderLPComponent', () => {
  let component: HeaderLPComponent;
  let fixture: ComponentFixture<HeaderLPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderLPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderLPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
