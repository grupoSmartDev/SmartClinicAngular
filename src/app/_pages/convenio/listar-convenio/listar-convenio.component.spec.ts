import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConvenioComponent } from './listar-convenio.component';

describe('ListarConvenioComponent', () => {
  let component: ListarConvenioComponent;
  let fixture: ComponentFixture<ListarConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarConvenioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
