import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NoteModel } from './models/note.model';

@Injectable({ providedIn: 'root' })
export class PersonNoteService {
  constructor(private http: HttpClient) {}

  list(personId: number): Observable<Array<NoteModel>> {
    return this.http.get<Array<NoteModel>>(`/api/persons/${personId}/notes`);
  }

  create(personId: number, text: string): Observable<NoteModel> {
    const command = { text };
    return this.http.post<NoteModel>(`/api/persons/${personId}/notes`, command);
  }

  update(personId: number, noteId: number, text: string): Observable<void> {
    const command = { text };
    return this.http.put<void>(`/api/persons/${personId}/notes/${noteId}`, command);
  }

  delete(personId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`/api/persons/${personId}/notes/${noteId}`);
  }
}
