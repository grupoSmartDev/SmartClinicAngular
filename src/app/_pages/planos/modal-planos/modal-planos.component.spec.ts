import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlanosComponent } from './modal-planos.component';

describe('ModalPlanosComponent', () => {
  let component: ModalPlanosComponent;
  let fixture: ComponentFixture<ModalPlanosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPlanosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPlanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
