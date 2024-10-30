import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSubCentroDeCustoComponent } from './listar-sub-centro-de-custo.component';

describe('ListarSubCentroDeCustoComponent', () => {
  let component: ListarSubCentroDeCustoComponent;
  let fixture: ComponentFixture<ListarSubCentroDeCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarSubCentroDeCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarSubCentroDeCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
