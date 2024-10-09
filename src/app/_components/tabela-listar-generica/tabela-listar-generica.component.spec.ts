import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaListarGenericaComponent } from './tabela-listar-generica.component';

describe('TabelaListarGenericaComponent', () => {
  let component: TabelaListarGenericaComponent;
  let fixture: ComponentFixture<TabelaListarGenericaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabelaListarGenericaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaListarGenericaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
