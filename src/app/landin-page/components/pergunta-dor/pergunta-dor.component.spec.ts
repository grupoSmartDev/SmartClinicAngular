import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerguntaDorComponent } from './pergunta-dor.component';

describe('PerguntaDorComponent', () => {
  let component: PerguntaDorComponent;
  let fixture: ComponentFixture<PerguntaDorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerguntaDorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerguntaDorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
