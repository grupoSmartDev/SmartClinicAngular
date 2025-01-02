import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanoContasComponent } from './listar-plano-contas.component';

describe('ListarPlanoContasComponent', () => {
  let component: ListarPlanoContasComponent;
  let fixture: ComponentFixture<ListarPlanoContasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPlanoContasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPlanoContasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
