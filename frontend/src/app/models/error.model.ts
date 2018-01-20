export interface FunctionalErrorModel {
  code: string;
  parameters?: { [key: string]: any };
}

export interface TechnicalErrorModel {
  status?: number;
  message: string;
}

export const ERRORS: { [key: string]: string } = Object.freeze({
  USER_LOGIN_ALREADY_EXISTS: 'Un utilisateur ayant le même identifiant existe déjà.',
  INCOME_SOURCE_TYPE_NAME_ALREADY_EXISTS: 'Un type de revenu du même nom existe déjà.',
  INCOME_SOURCE_NAME_ALREADY_EXISTS: 'Une source de revenu du même nom existe déjà.',
  CHARGE_CATEGORY_NAME_ALREADY_EXISTS: 'Une catégorie de charge du même nom existe déjà.',
  CHARGE_TYPE_NAME_ALREADY_EXISTS: 'Un type de charge du même nom existe déjà.',
  __TEST__: 'Hello ${login}'
});
