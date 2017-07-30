import { Component } from '@angular/core';
import { SearchCityService } from '../search-city.service';
import { HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeWhile';

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

  constructor(private cityService: SearchCityService) { }

  upload(fileChangeEvent) {
    const file = fileChangeEvent.target.files[0];
    const reader = this._createFileReader();

    reader.onload = fileLoadedEvent => {
      this.status = 'uploading';
      const startTime = this._now();

      this.cityService.uploadCities(fileLoadedEvent.target['result'])
        .subscribe(progressEvent => {
          if (progressEvent.type === HttpEventType.UploadProgress) {
            const elapsedTime = this._now() - startTime;
            const estimatedUploadTime = (progressEvent.total / progressEvent.loaded) * elapsedTime;
            const estimatedTotalTime = estimatedUploadTime + ESTIMATED_PROCESSING_TIME_IN_MILLIS;

            this.progress = elapsedTime / estimatedTotalTime;

            if (progressEvent.loaded >= progressEvent.total) {
              // the upload is done. Now we're processing, and updating the progress each 500 ms.
              this.status = 'processing';

              // generate fake progress every half-second but
              // - stop before the end, in case the processing time is longer then estimated
              // - stop if we received the response, in case the processing time is shorted than estimated
              Observable.interval(500)
                .takeWhile(() => (this._now() - startTime) < estimatedTotalTime && this.progress < 1)
                .subscribe(() => this.progress = (this._now() - startTime) / estimatedTotalTime);
            }
          }
        }, () => {
          this.progress = 1
          this.status = 'failed';
        }, () => {
          this.progress = 1;
          this.status = 'done';
        });
    };

    reader.readAsText(file, 'UTF8');
  }

  // to ease testing
  _createFileReader(): FileReader {
    return new FileReader();
  }

  // to ease testing
  _now() {
    return new Date().getTime();
  }
}
