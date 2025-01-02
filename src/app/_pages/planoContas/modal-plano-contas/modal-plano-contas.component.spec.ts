import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlanoContasComponent } from './modal-plano-contas.component';

describe('ModalPlanoContasComponent', () => {
  let component: ModalPlanoContasComponent;
  let fixture: ComponentFixture<ModalPlanoContasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPlanoContasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPlanoContasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
