import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConvenioComponent } from './modal-convenio.component';

describe('ModalConvenioComponent', () => {
  let component: ModalConvenioComponent;
  let fixture: ComponentFixture<ModalConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalConvenioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
