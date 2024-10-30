import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBancoComponent } from './modal-banco.component';

describe('ModalBancoComponent', () => {
  let component: ModalBancoComponent;
  let fixture: ComponentFixture<ModalBancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBancoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
