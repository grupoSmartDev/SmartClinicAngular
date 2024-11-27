import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAtividadeComponent } from './lista-atividade.component';

describe('ListaAtividadeComponent', () => {
  let component: ListaAtividadeComponent;
  let fixture: ComponentFixture<ListaAtividadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaAtividadeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
