import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageManagementService {

  storageItems$!: Observable<{ [key: string]: string | null; }>;

  constructor() {
    this.updateStorageItems();
  }

  logoutCleanStorage() {

    Object.keys(localStorage)
    .filter(key => key !== StorageKeys.serverAddress)
    .forEach(key => localStorage.removeItem(key));
    
    this.updateStorageItems();
    return true;
  }

  public saveInStorage(key: string, value: string){
    localStorage.setItem(key, value);
    this.updateStorageItems();
  }

  getFromStorage(key: string) : any{
    return localStorage.getItem(key);
  }

  updateStorageItems() {
    const items: { [key: string]: string | null } = {};
    Object.keys(localStorage).forEach(key => {
      items[key] = localStorage.getItem(key);
    });
    this.storageItems$ = of(items);
  }

}

export class StorageKeys {
  public static token = 'token';
  public static isAdmin = 'isAdmin';
  public static isUserLoggedIn = 'isUserLoggedIn';
  public static serverAddress = 'serverAddress';
  public static isServerAlive = 'isServerAlive'
}