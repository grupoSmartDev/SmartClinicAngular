import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAtivarComponent } from './dialog-ativar.component';

describe('DialogAtivarComponent', () => {
  let component: DialogAtivarComponent;
  let fixture: ComponentFixture<DialogAtivarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAtivarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAtivarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
