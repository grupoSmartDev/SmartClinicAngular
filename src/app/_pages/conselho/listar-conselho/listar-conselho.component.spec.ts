import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarConselhoComponent } from './listar-conselho.component';

describe('ListarConselhoComponent', () => {
  let component: ListarConselhoComponent;
  let fixture: ComponentFixture<ListarConselhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarConselhoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarConselhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
