import { TestBed } from '@angular/core/testing';

import { CajaSesionService } from './caja-sesion.service';

describe('CajaSesionService', () => {
  let service: CajaSesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CajaSesionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
