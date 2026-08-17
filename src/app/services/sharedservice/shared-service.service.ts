import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../../shared/models/project';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private currentQrCodeValueSubject = new BehaviorSubject<Project>(new Project());
  currentQrCodeValue: Observable<Project> = this.currentQrCodeValueSubject.asObservable();

  setQrCodeValue(project: Project) {
    this.currentQrCodeValueSubject.next(project);
  }
}
