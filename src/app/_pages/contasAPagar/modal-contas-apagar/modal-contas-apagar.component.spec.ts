import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContasAPagarComponent } from './modal-contas-apagar.component';

describe('ModalContasAPagarComponent', () => {
  let component: ModalContasAPagarComponent;
  let fixture: ComponentFixture<ModalContasAPagarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalContasAPagarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalContasAPagarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
