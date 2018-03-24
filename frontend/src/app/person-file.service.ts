import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { FileModel } from './models/file.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonFileService {

  constructor(private http: HttpClient) { }

  list(personId: number): Observable<Array<FileModel>> {
    return this.http.get<Array<FileModel>>(`/api/persons/${personId}/files`);
  }

  url(personId: number, name: string) {
    const encodedName = encodeURIComponent(name);
    return `/api/persons/${personId}/files/${encodedName}`;
  }

  delete(personId: number, name: string): Observable<void> {
    return this.http.delete<void>(this.url(personId, name));
  }

  create(personId: number, file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `/api/persons/${personId}/files`, formData, {
      reportProgress: true,
    });

    return this.http.request(req);
  }
}
