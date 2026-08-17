import { LogEntry } from '../shared/models/log-entry';

export const LOGS_MOCK: LogEntry[] = [
  {
    Id: 1,
    Date: new Date(),
    Type: 'INFO',
    Controller: 'Project',
    User: 'admin',
    Message: 'Project created'
  },
  {
    Id: 2,
    Date: new Date(),
    Type: 'WARNING',
    Controller: 'ImageUpload',
    User: 'arbeiter01',
    Message: 'Image waiting for synchronization'
  }
];