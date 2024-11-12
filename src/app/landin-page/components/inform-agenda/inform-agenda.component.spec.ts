import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformAgendaComponent } from './inform-agenda.component';

describe('InformAgendaComponent', () => {
  let component: InformAgendaComponent;
  let fixture: ComponentFixture<InformAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformAgendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
