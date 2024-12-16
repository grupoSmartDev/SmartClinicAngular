import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfissaoComponent } from './modal-profissao.component';

describe('ModalProfissaoComponent', () => {
  let component: ModalProfissaoComponent;
  let fixture: ComponentFixture<ModalProfissaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalProfissaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProfissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
