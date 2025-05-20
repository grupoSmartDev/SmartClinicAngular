import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaListarComponent } from './agenda-listar.component';

describe('AgendaListarComponent', () => {
  let component: AgendaListarComponent;
  let fixture: ComponentFixture<AgendaListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaListarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
