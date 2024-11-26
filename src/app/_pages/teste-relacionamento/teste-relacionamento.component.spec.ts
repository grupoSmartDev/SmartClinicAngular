import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteRelacionamentoComponent } from './teste-relacionamento.component';

describe('TesteRelacionamentoComponent', () => {
  let component: TesteRelacionamentoComponent;
  let fixture: ComponentFixture<TesteRelacionamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TesteRelacionamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteRelacionamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
