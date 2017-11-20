import { TestBed } from '@angular/core/testing';

import { ChargeCategoryService } from './charge-category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChargeCategoryModel } from './models/charge-category.model';
import { ChargeCategoryCommand } from './models/charge-category.command';
import { HttpTester } from './http-tester.spec';

describe('ChargeCategoryService', () => {

  let httpTester: HttpTester;
  let service: ChargeCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChargeCategoryService
      ],
      imports: [HttpClientTestingModule]
    });

    const http = TestBed.get(HttpTestingController);
    httpTester = new HttpTester(http);
    service = TestBed.get(ChargeCategoryService);
  });

  it('should get a charge category', () => {
    const expectedChargeCategory = { id: 1 } as ChargeCategoryModel;
    httpTester.testGet('/api/charge-categories/1', expectedChargeCategory, service.get(1));
  });

  it('should update a charge category', () => {
    const fakeChargeCategory = { name: 'rental' } as ChargeCategoryCommand;
    httpTester.testPut(
      '/api/charge-categories/2',
      fakeChargeCategory,
      service.update(2, fakeChargeCategory));
  });

  it('should create a charge category', () => {
    const fakeChargeCategory = { name: 'foo' } as ChargeCategoryCommand;
    const expectedChargeCategory = { id: 2 } as ChargeCategoryModel;
    httpTester.testPost(
      '/api/charge-categories',
      fakeChargeCategory,
      expectedChargeCategory,
      service.create(fakeChargeCategory));
  });

  it('should list charge categories', () => {
    const expectedChargeCategories = [{ id: 1 }] as Array<ChargeCategoryModel>;
    httpTester.testGet('/api/charge-categories', expectedChargeCategories, service.list());
  });
});
