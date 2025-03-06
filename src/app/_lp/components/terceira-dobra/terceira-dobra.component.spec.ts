import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerceiraDobraComponent } from './terceira-dobra.component';

describe('TerceiraDobraComponent', () => {
  let component: TerceiraDobraComponent;
  let fixture: ComponentFixture<TerceiraDobraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerceiraDobraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerceiraDobraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
