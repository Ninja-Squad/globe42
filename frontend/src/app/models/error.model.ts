import { HttpErrorResponse } from '@angular/common/http';
export interface FunctionalErrorModel {
  code: string;
  parameters?: { [key: string]: any };
}

export interface TechnicalErrorModel {
  status?: number;
  message: string;
}

export const ERRORS = Object.freeze({
  USER_LOGIN_ALREADY_EXISTS: 'Un utilisateur ayant le même identifiant existe déjà.',
  INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS: 'Un type de revenu du même nom existe déjà.',
  INCOME_SOURCE_NAME_ALREADY_EXISTS: 'Une source de revenu du même nom existe déjà.',
  __TEST__: 'Hello ${login}'
});
