import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCentroDeCustoComponent } from './listar-centro-de-custo.component';

describe('ListarCentroDeCustoComponent', () => {
  let component: ListarCentroDeCustoComponent;
  let fixture: ComponentFixture<ListarCentroDeCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarCentroDeCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCentroDeCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
