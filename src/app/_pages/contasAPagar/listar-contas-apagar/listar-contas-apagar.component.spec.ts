import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarContasAPagarComponent } from './listar-contas-apagar.component';

describe('ListarContasAPagarComponent', () => {
  let component: ListarContasAPagarComponent;
  let fixture: ComponentFixture<ListarContasAPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarContasAPagarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarContasAPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
