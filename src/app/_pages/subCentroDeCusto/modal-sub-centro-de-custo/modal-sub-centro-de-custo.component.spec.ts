import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubCentroDeCustoComponent } from './modal-sub-centro-de-custo.component';

describe('ModalSubCentroDeCustoComponent', () => {
  let component: ModalSubCentroDeCustoComponent;
  let fixture: ComponentFixture<ModalSubCentroDeCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalSubCentroDeCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSubCentroDeCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
