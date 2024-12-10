import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFinancPagarComponent } from './listar-financ-pagar.component';

describe('ListarFinancPagarComponent', () => {
  let component: ListarFinancPagarComponent;
  let fixture: ComponentFixture<ListarFinancPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarFinancPagarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarFinancPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
