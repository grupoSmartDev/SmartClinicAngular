import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPagarSinteticoComponent } from './listar-pagar-sintetico.component';

describe('ListarPagarSinteticoComponent', () => {
  let component: ListarPagarSinteticoComponent;
  let fixture: ComponentFixture<ListarPagarSinteticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPagarSinteticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPagarSinteticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
