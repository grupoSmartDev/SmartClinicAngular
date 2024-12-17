import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProfissaoComponent } from './listar-profissao.component';

describe('ListarProfissaoComponent', () => {
  let component: ListarProfissaoComponent;
  let fixture: ComponentFixture<ListarProfissaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarProfissaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarProfissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
