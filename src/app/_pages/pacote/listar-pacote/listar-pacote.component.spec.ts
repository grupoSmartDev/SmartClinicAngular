import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPacoteComponent } from './listar-pacote.component';

describe('ListarPacoteComponent', () => {
  let component: ListarPacoteComponent;
  let fixture: ComponentFixture<ListarPacoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPacoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPacoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
