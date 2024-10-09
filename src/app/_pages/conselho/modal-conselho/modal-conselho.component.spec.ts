import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConselhoComponent } from './modal-conselho.component';

describe('ModalConselhoComponent', () => {
  let component: ModalConselhoComponent;
  let fixture: ComponentFixture<ModalConselhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalConselhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConselhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
