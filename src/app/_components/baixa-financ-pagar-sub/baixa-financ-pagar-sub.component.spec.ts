import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

import { BaixaFinancPagarSubComponent } from './baixa-financ-pagar-sub.component';

describe('BaixaFinancPagarSubComponent', () => {
  let component: BaixaFinancPagarSubComponent;
  let fixture: ComponentFixture<BaixaFinancPagarSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaixaFinancPagarSubComponent],
      imports: [FormsModule, HttpClientTestingModule, ToastrModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaixaFinancPagarSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
