import { TestBed } from '@angular/core/testing';

import { FormatarDataParaInputService } from './formatar-data-para-input.service';

describe('FormatarDataParaInputService', () => {
  let service: FormatarDataParaInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatarDataParaInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
