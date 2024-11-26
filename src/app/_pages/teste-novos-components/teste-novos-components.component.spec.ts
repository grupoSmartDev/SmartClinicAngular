import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteNovosComponentsComponent } from './teste-novos-components.component';

describe('TesteNovosComponentsComponent', () => {
  let component: TesteNovosComponentsComponent;
  let fixture: ComponentFixture<TesteNovosComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TesteNovosComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteNovosComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
