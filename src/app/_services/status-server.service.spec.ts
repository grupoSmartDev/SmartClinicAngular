import { TestBed } from '@angular/core/testing';

import { StatusServerService } from './status-server.service';

describe('StatusServerService', () => {
  let service: StatusServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
