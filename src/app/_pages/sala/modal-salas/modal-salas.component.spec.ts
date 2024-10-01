import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSalasComponent } from './modal-salas.component';

describe('ModalSalasComponent', () => {
  let component: ModalSalasComponent;
  let fixture: ComponentFixture<ModalSalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalSalasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
