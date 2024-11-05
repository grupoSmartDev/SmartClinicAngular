import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProfissionalComponent } from './listar-profissional.component';

describe('ListarProfissionalComponent', () => {
  let component: ListarProfissionalComponent;
  let fixture: ComponentFixture<ListarProfissionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarProfissionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarProfissionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
