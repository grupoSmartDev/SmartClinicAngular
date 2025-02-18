import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarReceberSinteticoComponent } from './listar-receber-sintetico.component';

describe('ListarReceberSinteticoComponent', () => {
  let component: ListarReceberSinteticoComponent;
  let fixture: ComponentFixture<ListarReceberSinteticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarReceberSinteticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarReceberSinteticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
