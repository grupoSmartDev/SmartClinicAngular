import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfissionalComponent } from './modal-profissional.component';

describe('ModalProfissionalComponent', () => {
  let component: ModalProfissionalComponent;
  let fixture: ComponentFixture<ModalProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalProfissionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
