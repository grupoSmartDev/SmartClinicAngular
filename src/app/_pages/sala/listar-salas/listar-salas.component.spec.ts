import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSalasComponent } from './listar-salas.component';

describe('ListarSalasComponent', () => {
  let component: ListarSalasComponent;
  let fixture: ComponentFixture<ListarSalasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarSalasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarSalasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
