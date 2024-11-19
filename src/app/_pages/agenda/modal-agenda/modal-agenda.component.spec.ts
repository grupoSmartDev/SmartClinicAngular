import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgendaComponent } from './modal-agenda.component';

describe('ModalAgendaComponent', () => {
  let component: ModalAgendaComponent;
  let fixture: ComponentFixture<ModalAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalAgendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
