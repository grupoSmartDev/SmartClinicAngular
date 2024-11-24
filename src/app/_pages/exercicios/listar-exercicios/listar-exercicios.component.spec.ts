import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarExerciciosComponent } from './listar-exercicios.component';

describe('ListarExerciciosComponent', () => {
  let component: ListarExerciciosComponent;
  let fixture: ComponentFixture<ListarExerciciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarExerciciosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarExerciciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
