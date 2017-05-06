import { Injectable } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
  months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
  fullMonths: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septempbre', 'Octobre', 'Novembre', 'Décembre']
};

@Injectable()
export class FrenchDatepickerI18nService extends NgbDatepickerI18n {

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES.weekdays[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES.months[month - 1];
  }

  getMonthFullName(month: number): string {
    return I18N_VALUES.fullMonths[month - 1];
  }
}
