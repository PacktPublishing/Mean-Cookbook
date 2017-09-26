import { TestBed, inject } from '@angular/core/testing';

import { CurrentUserService } from './current-user.service';

describe('CurrentUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentUserService]
    });
  });

  it('should ...', inject([CurrentUserService], (service: CurrentUserService) => {
    expect(service).toBeTruthy();
  }));
});
