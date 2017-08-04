export interface Page<T> {
  content: Array<T>;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
