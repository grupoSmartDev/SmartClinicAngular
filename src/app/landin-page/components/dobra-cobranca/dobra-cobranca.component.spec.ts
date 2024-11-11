import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DobraCobrancaComponent } from './dobra-cobranca.component';

describe('DobraCobrancaComponent', () => {
  let component: DobraCobrancaComponent;
  let fixture: ComponentFixture<DobraCobrancaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DobraCobrancaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DobraCobrancaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
