import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFinancReceberComponent } from './listar-financ-receber.component';

describe('ListarFinancReceberComponent', () => {
  let component: ListarFinancReceberComponent;
  let fixture: ComponentFixture<ListarFinancReceberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarFinancReceberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarFinancReceberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
