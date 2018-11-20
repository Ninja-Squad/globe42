import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileModel } from '../models/file.model';
import { PersonFileService } from '../person-file.service';
import { PersonModel } from '../models/person.model';
import { ConfirmService } from '../confirm.service';
import { Comparator, sortBy } from '../utils';
import { HttpEventType } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs/operators';

@Component({
  selector: 'gl-person-files',
  templateUrl: './person-files.component.html',
  styleUrls: ['./person-files.component.scss']
})
export class PersonFilesComponent implements OnInit {

  person: PersonModel;
  loading = false;
  uploading = false;
  uploadProgress: number;
  files: Array<FileModel>;

  constructor(route: ActivatedRoute,
              private personFileService: PersonFileService,
              private confirmService: ConfirmService) {
    this.person = route.parent.snapshot.data['person'];
  }

  ngOnInit(): void {
    this.loadFiles();
  }

  url(file: FileModel): string {
    return this.personFileService.url(this.person.id, file.name);
  }

  delete(file: FileModel) {
    this.confirmService.confirm({
      message: 'Voulez-vous vraiment supprimer ce document\u00A0?'
    }).pipe(
      switchMap(() => this.personFileService.delete(this.person.id, file.name))
    ).subscribe(() => this.loadFiles());
  }

  upload(fileChangeEvent: Event) {
    this.uploading = true;

    const file = (fileChangeEvent.target as HTMLInputElement).files[0];

    this.personFileService.create(this.person.id, file)
      .pipe(
        finalize(() => this.uploading = false)
      ).subscribe(
        progressEvent => {
          if (progressEvent.type === HttpEventType.UploadProgress) {
            this.uploadProgress = progressEvent.loaded / progressEvent.total;
          }
        },
        () => {},
        () => this.loadFiles());
  }

  private loadFiles() {
    // display the spinner after 300ms, unless the notes have loaded before. Note: delay() is untestable,
    // see https://github.com/angular/angular/issues/10127
    window.setTimeout(() => this.loading = !this.files, 300);

    this.personFileService.list(this.person.id)
      .subscribe(files => {
        this.loading = false;
        this.files = sortBy(files, Comparator.comparing<FileModel>(file => file.creationInstant).reversed());
      });
  }
}
