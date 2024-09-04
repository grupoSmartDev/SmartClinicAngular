import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelNomeComponent } from './label-nome.component';

describe('LabelNomeComponent', () => {
  let component: LabelNomeComponent;
  let fixture: ComponentFixture<LabelNomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabelNomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelNomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
