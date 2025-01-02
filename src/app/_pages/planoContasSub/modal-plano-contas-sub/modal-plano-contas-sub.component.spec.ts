import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlanoContasSubComponent } from './modal-plano-contas-sub.component';

describe('ModalPlanoContasSubComponent', () => {
  let component: ModalPlanoContasSubComponent;
  let fixture: ComponentFixture<ModalPlanoContasSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPlanoContasSubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPlanoContasSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
