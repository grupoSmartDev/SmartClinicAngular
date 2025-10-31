import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPacoteComponent } from './modal-pacote.component';

describe('ModalPacoteComponent', () => {
  let component: ModalPacoteComponent;
  let fixture: ComponentFixture<ModalPacoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPacoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPacoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
