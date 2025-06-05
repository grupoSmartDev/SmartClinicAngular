import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBancoComponent } from './select-banco.component';

describe('SelectBancoComponent', () => {
  let component: SelectBancoComponent;
  let fixture: ComponentFixture<SelectBancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectBancoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
