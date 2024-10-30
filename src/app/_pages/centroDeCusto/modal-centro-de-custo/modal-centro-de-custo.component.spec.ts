import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCentroDeCustoComponent } from './modal-centro-de-custo.component';

describe('ModalCentroDeCustoComponent', () => {
  let component: ModalCentroDeCustoComponent;
  let fixture: ComponentFixture<ModalCentroDeCustoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCentroDeCustoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCentroDeCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
