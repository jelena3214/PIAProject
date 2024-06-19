import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { waiterGuardGuard } from './waiter-guard.guard';

describe('waiterGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => waiterGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
