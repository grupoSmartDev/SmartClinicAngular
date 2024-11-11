import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuvidasFaqComponent } from './duvidas-faq.component';

describe('DuvidasFaqComponent', () => {
  let component: DuvidasFaqComponent;
  let fixture: ComponentFixture<DuvidasFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuvidasFaqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuvidasFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
