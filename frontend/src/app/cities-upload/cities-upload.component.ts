import { Component } from '@angular/core';
import { SearchCityService } from '../search-city.service';
import { HttpEventType } from '@angular/common/http';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { DateTime } from 'luxon';

const ESTIMATED_PROCESSING_TIME_IN_MILLIS = 20000;

@Component({
  selector: 'gl-cities-upload',
  templateUrl: './cities-upload.component.html',
  styleUrls: ['./cities-upload.component.scss']
})
export class CitiesUploadComponent {
  status: 'pending' | 'uploading' | 'processing' | 'done' | 'failed' = 'pending';

  /**
   * The progress, between 0 and 1
   */
  progress: number;

  constructor(private cityService: SearchCityService) {}

  upload(fileChangeEvent: Event) {
    const file = (fileChangeEvent.target as HTMLInputElement).files[0];
    const reader = this._createFileReader();

    reader.onload = (fileLoadedEvent: Event) => {
      this.status = 'uploading';
      const startTime = this.now();

      this.cityService.uploadCities((fileLoadedEvent.target as any).result).subscribe(
        progressEvent => {
          if (progressEvent.type === HttpEventType.UploadProgress) {
            const elapsedTime = this.now() - startTime;
            const estimatedUploadTime = (progressEvent.total / progressEvent.loaded) * elapsedTime;
            const estimatedTotalTime = estimatedUploadTime + ESTIMATED_PROCESSING_TIME_IN_MILLIS;

            this.progress = elapsedTime / estimatedTotalTime;

            if (progressEvent.loaded >= progressEvent.total) {
              // the upload is done. Now we're processing, and updating the progress each 500 ms.
              this.status = 'processing';

              // generate fake progress every half-second but
              // - stop before the end, in case the processing time is longer then estimated
              // - stop if we received the response, in case the processing time is shorted than estimated
              interval(500)
                .pipe(
                  takeWhile(() => this.now() - startTime < estimatedTotalTime && this.progress < 1)
                )
                .subscribe(() => (this.progress = (this.now() - startTime) / estimatedTotalTime));
            }
          }
        },
        () => {
          this.progress = 1;
          this.status = 'failed';
        },
        () => {
          this.progress = 1;
          this.status = 'done';
        }
      );
    };

    reader.readAsText(file, 'UTF8');
  }

  // to ease testing
  _createFileReader(): FileReader {
    return new FileReader();
  }

  private now(): number {
    return DateTime.local().valueOf();
  }
}
