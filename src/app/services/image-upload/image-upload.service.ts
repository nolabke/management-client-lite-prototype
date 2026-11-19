import { Injectable, inject } from '@angular/core';
import { ApiImage } from '../../shared/models/api-image';
import { Project } from '../../shared/models/project';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StorageManagementService } from '../storage-management/storage-management.service';
import { MOCK_IMAGE_UPLOAD_RESPONSE } from '../../mocks/image-upload.mock';


@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  http: HttpClient = inject(HttpClient);
  storageManagementService: StorageManagementService = inject(StorageManagementService);

  private readonly useMock = false;


  constructor() { }


  public formatRequest(images: ApiImage[], project: Project): FormData {

    const formData = new FormData();

    formData.append('projectno', project.ProjectNo);
    formData.append('name', project.Name);
    formData.append('street', project.Street);
    formData.append('city', project.City);
    formData.append('zip', project.Zip);
    formData.append('latitude', project.Latitude.toString());
    formData.append('longitude', project.Longitude.toString());

    let i = 1;

    images.forEach((image) => {
      if (image.Blob) {
        formData.append(
          'file_' + i,
          image.Blob,
          image.Format
        );

        i++;
      }
    });

    return formData;
  }


  public uploadImages(
    formData: FormData,
    options?: {
      reportProgress?: boolean;
      observe?: 'events' | 'body' | 'response';
    }
  ): Observable<any> {


    if (this.useMock) {

      console.log('Mock upload images');

      return of({
        type: 'UploadComplete',
        body: MOCK_IMAGE_UPLOAD_RESPONSE
      });

    }


    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');


    return this.http.post(
      serverAddress + '/api/Image/Upload',
      formData,
      {
        responseType: 'json',
        reportProgress: true,
        observe: 'events'
      }
    );
  }
}