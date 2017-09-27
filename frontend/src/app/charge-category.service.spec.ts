import { TestBed, inject } from '@angular/core/testing';

import { ChargeCategoryService } from './charge-category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChargeCategoryModel } from './models/charge-category.model';
import { ChargeCategoryCommand } from './models/charge-category.command';

describe('ChargeCategoryService', () => {

  let http: HttpTestingController;
  let service: ChargeCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChargeCategoryService
      ],
      imports: [HttpClientTestingModule]
    });

    http = TestBed.get(HttpTestingController);
    service = TestBed.get(ChargeCategoryService);
  });

  it('should get a charge category', () => {
    const expectedChargeCategory = { id: 1 } as ChargeCategoryModel;

    let actualChargeCategory;
    service.get(1).subscribe(chargeCategory => actualChargeCategory = chargeCategory);
    http.expectOne({url: '/api/charge-categories/1', method: 'GET'}).flush(expectedChargeCategory);

    expect(actualChargeCategory).toEqual(expectedChargeCategory);
  });

  it('should update a charge category', () => {
    const fakeChargeCategory = { name: 'rental' } as ChargeCategoryCommand;
    service.update(2, fakeChargeCategory).subscribe(() => {});

    const testRequest = http.expectOne({ url: '/api/charge-categories/2', method: 'PUT' });
    expect(testRequest.request.body).toEqual(fakeChargeCategory);
    testRequest.flush(null);
  });

  it('should create a charge category', () => {
    const fakeChargeCategory = { name: 'foo' } as ChargeCategoryCommand;
    const expectedChargeCategory = { id: 2 } as ChargeCategoryModel;

    let actualChargeCategory;
    service.create(fakeChargeCategory).subscribe(chargeCategory => actualChargeCategory = chargeCategory);

    const testRequest = http.expectOne({ url: '/api/charge-categories', method: 'POST' });
    expect(testRequest.request.body).toEqual(fakeChargeCategory);
    testRequest.flush(expectedChargeCategory);

    expect(actualChargeCategory).toEqual(expectedChargeCategory);
  });

  it('should list charge categories', () => {
    const expectedChargeCategories = [{ id: 1 }] as Array<ChargeCategoryModel>;

    let actualChargeCategories;
    service.list().subscribe(chargeCategories => actualChargeCategories = chargeCategories);

    http.expectOne({url: '/api/charge-categories', method: 'GET'}).flush(expectedChargeCategories);

    expect(actualChargeCategories).toEqual(expectedChargeCategories);
  });
});
