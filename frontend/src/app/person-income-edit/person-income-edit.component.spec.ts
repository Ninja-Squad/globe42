import { TestBed } from '@angular/core/testing';

import { PersonIncomeEditComponent } from './person-income-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FullnamePipe } from '../fullname.pipe';
import { of } from 'rxjs';
import { IncomeSourceModel } from '../models/income-source.model';
import { IncomeService } from '../income.service';
import { ValidationDefaultsComponent } from '../validation-defaults/validation-defaults.component';
import { ValdemortModule } from 'ngx-valdemort';
import { PageTitleDirective } from '../page-title.directive';
import { IncomeModel } from '../models/income.model';
import { ComponentTester } from 'ngx-speculoos';

class PersonIncomeEditComponentTester extends ComponentTester<PersonIncomeEditComponent> {
  constructor() {
    super(PersonIncomeEditComponent);
  }

  get title() {
    return this.element('h1');
  }

  get incomeSource() {
    return this.select('#source');
  }

  get monthlyAmount() {
    return this.input('#monthlyAmount');
  }

  get save() {
    return this.button('#save');
  }
}

describe('PersonIncomeEditComponent', () => {
  const incomeSources = [
    { id: 1, name: 'B' },
    { id: 2, name: 'A', maxMonthlyAmount: 100 }
  ] as Array<IncomeSourceModel>;

  const person = { id: 42, firstName: 'Jean-Baptiste', lastName: 'Nizet', nickName: 'JB' };

  let tester: PersonIncomeEditComponentTester;

  beforeEach(() => {
    const activatedRoute = {
      snapshot: { data: { person, incomeSources } }
    };

    TestBed.configureTestingModule({
      declarations: [
        PersonIncomeEditComponent,
        FullnamePipe,
        ValidationDefaultsComponent,
        PageTitleDirective
      ],
      imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ValdemortModule
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });

    TestBed.createComponent(ValidationDefaultsComponent).detectChanges();
    tester = new PersonIncomeEditComponentTester();
    tester.detectChanges();
  });

  it('should have a title', () => {
    expect(tester.title).toContainText('Créer un nouveau revenu pour Jean-Baptiste Nizet (JB)');
  });

  it('should expose sorted income sources', () => {
    expect(tester.componentInstance.incomeSources.map(t => t.name)).toEqual(['A', 'B']);
  });

  it('should expose a default income', () => {
    expect(tester.componentInstance.incomeForm.value).toEqual({
      source: null,
      monthlyAmount: null
    });
  });

  it('should display the income in a form, and validate the form', () => {
    expect(tester.incomeSource).toHaveSelectedLabel('');
    expect(tester.incomeSource.optionLabels.length).toBe(incomeSources.length + 1);
    expect(tester.monthlyAmount).toHaveValue('');

    expect(tester.testElement).not.toContainText('La nature de la prestation est obligatoire');
    expect(tester.testElement).not.toContainText('Le montant mensuel est obligatoire');

    tester.save.click();

    expect(tester.testElement).toContainText('La nature de la prestation est obligatoire');
    expect(tester.testElement).toContainText('Le montant mensuel est obligatoire');

    tester.monthlyAmount.fillWith('0');

    expect(tester.testElement).toContainText('La nature de la prestation est obligatoire');
    expect(tester.testElement).toContainText('Le montant mensuel doit être positif');

    tester.incomeSource.selectIndex(1);
    tester.monthlyAmount.fillWith('101');

    expect(tester.testElement).not.toContainText('La nature de la prestation est obligatoire');
    expect(tester.testElement).toContainText(
      'Le montant mensuel ne peut pas dépasser la valeur maximale pour cette nature de prestation\u00a0: 100,00\u00a0€'
    );

    tester.incomeSource.selectLabel('');

    expect(tester.testElement).not.toContainText(
      'Le montant mensuel ne peut pas dépasser la valeur maximale'
    );
  });

  it('should save the income and navigate to the resource list', () => {
    const incomeService = TestBed.inject(IncomeService);
    const router = TestBed.inject(Router);

    spyOn(incomeService, 'create').and.returnValue(
      of({
        id: 42
      } as IncomeModel)
    );
    spyOn(router, 'navigate');

    tester.incomeSource.selectIndex(1);
    tester.monthlyAmount.fillWith('12');
    tester.save.click();

    expect(incomeService.create).toHaveBeenCalledWith(42, { sourceId: 2, monthlyAmount: 12 });
    expect(router.navigate).toHaveBeenCalledWith(['persons', person.id, 'resources']);
  });
});
