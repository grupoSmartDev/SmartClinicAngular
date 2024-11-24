import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExercicioComponent } from './modal-exercicio.component';

describe('ModalExercicioComponent', () => {
  let component: ModalExercicioComponent;
  let fixture: ComponentFixture<ModalExercicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalExercicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
