import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarDespesaComponent } from './listar-despesa.component';

describe('ListarDespesaComponent', () => {
  let component: ListarDespesaComponent;
  let fixture: ComponentFixture<ListarDespesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarDespesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarDespesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
