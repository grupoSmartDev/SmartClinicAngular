import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarComissoesComponent } from './listar-comissoes.component';

describe('ListarComissoesComponent', () => {
  let component: ListarComissoesComponent;
  let fixture: ComponentFixture<ListarComissoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarComissoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarComissoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
