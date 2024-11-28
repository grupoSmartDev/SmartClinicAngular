import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlanosComponent } from './listar-planos.component';

describe('ListarPlanosComponent', () => {
  let component: ListarPlanosComponent;
  let fixture: ComponentFixture<ListarPlanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPlanosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPlanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
