import { TestBed } from '@angular/core/testing';
import { CakeData } from './cake-data';

describe('CakeData', () => {
  let service: CakeData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CakeData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
