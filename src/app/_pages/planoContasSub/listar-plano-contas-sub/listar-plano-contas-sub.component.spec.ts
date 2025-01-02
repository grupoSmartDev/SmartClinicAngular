import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanoContasSubComponent } from './listar-plano-contas-sub.component';

describe('ListarPlanoContasSubComponent', () => {
  let component: ListarPlanoContasSubComponent;
  let fixture: ComponentFixture<ListarPlanoContasSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPlanoContasSubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPlanoContasSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
