import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Project } from '../../shared/models/project';
import { PROJECTS_MOCK } from '../../mocks/projects.mock';
import { HttpClient } from '@angular/common/http';
import { StorageManagementService } from '../storage-management/storage-management.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private readonly useMock = true;

  private http = inject(HttpClient);
  private storageManagementService = inject(StorageManagementService);


  getProjects(): Observable<Project[]> {

    if (this.useMock) {
      return of(PROJECTS_MOCK);
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.get<Project[]>(
      serverAddress + '/api/Project'
    );
  }


  getLastLocation(): Observable<Project> {

    if (this.useMock) {
      return of(PROJECTS_MOCK[PROJECTS_MOCK.length - 1]);
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.get<Project>(
      serverAddress + '/api/Project/last'
    );
  }


  getByProjectNo(projectNo: string): Observable<Project> {

    if (this.useMock) {
      const project = PROJECTS_MOCK.find(
        p => p.ProjectNo === projectNo
      );

      return of(project ?? new Project());
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.get<Project>(
      `${serverAddress}/api/Project/byNo/${projectNo}`
    );
  }


  addProject(project: Project): Observable<any> {

    if (this.useMock) {
      PROJECTS_MOCK.push(project);

      return of({
        status: 201,
        message: 'Project added (mock)'
      });
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.post(
      serverAddress + '/api/Project',
      project
    );
  }


  updateProject(project: Project): Observable<any> {

    if (this.useMock) {

      const index = PROJECTS_MOCK.findIndex(
        p => p.Id === project.Id
      );

      if (index >= 0) {
        PROJECTS_MOCK[index] = project;
      }

      return of({
        status: 200,
        message: 'Project updated (mock)'
      });
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.put(
      serverAddress + '/api/Project',
      project
    );
  }


  deleteProject(projectId: number): Observable<any> {

    if (this.useMock) {

      const index = PROJECTS_MOCK.findIndex(
        p => p.Id === projectId
      );

      if (index >= 0) {
        PROJECTS_MOCK.splice(index, 1);
      }

      return of({
        status: 200,
        message: 'Project deleted (mock)'
      });
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.delete(
      `${serverAddress}/api/Project/${projectId}`
    );
  }


  getByProjectIdWithImages(projectId: number): Observable<Project> {

    if (this.useMock) {

      const project = PROJECTS_MOCK.find(
        p => p.Id === projectId
      );

      return of(project ?? new Project());
    }

    const serverAddress =
      this.storageManagementService.getFromStorage('serverAddress');

    return this.http.get<Project>(
      `${serverAddress}/api/Project/${projectId}/images`
    );
  }
}