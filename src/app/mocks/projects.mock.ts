import { Project } from '../shared/models/project';

export const PROJECTS_MOCK: Project[] = [
  {
    Id: 1,
    ProjectNo: 'P-2026-001',
    Name: 'Dachsanierung Müller GmbH',
    Street: 'Hauptstraße 12',
    Zip: '40210',
    City: 'Düsseldorf',
    Latitude: 51.2277,
    Longitude: 6.7735,
    IsDisabled: false,
    Images: []
  },
  {
    Id: 2,
    ProjectNo: 'P-2026-002',
    Name: 'Neubau Dach Weber',
    Street: 'Berliner Straße 45',
    Zip: '50667',
    City: 'Köln',
    Latitude: 50.9375,
    Longitude: 6.9603,
    IsDisabled: false,
    Images: []
  },
  {
    Id: 3,
    ProjectNo: 'P-2026-003',
    Name: 'Altbau Renovierung',
    Street: 'Lindenweg 8',
    Zip: '45127',
    City: 'Essen',
    Latitude: 51.4556,
    Longitude: 7.0116,
    IsDisabled: true,
    Images: []
  }
];