import { ApiImage } from '../shared/models/api-image';

export const IMAGES_MOCK: any[] = [
  {
    Id: 1,
    Uuid: 'img-001',
    Name: 'Dach Vorderseite',
    FileName: 'roof-front.jpg',
    Base64: null,
    Format: 'jpeg',
    Blob: null,
    Url: 'assets/images/demo/roof-front.jpg',
    IsSynced: 1,
    LocationId: 1,
    UploadDate: new Date('2026-07-01'),
    User: {
      Id: 1,
      UserName: 'admin',
      Password: null,
      FirstName: 'Thomas',
      LastName: 'Müller',
      LastLogin: new Date(),
      IsAdmin: true,
      IsDisabled: false
    },
    Location: {
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
    }
  },
  {
    Id: 2,
    Uuid: 'img-002',
    Name: 'Dach Detail',
    FileName: 'roof-detail.jpg',
    Base64: null,
    Format: 'jpeg',
    Blob: null,
    Url: 'assets/images/demo/roof-detail.jpg',
    IsSynced: 1,
    LocationId: 2,
    UploadDate: new Date('2026-07-05'),
    User: {
      Id: 2,
      UserName: 'arbeiter01',
      Password: null,
      FirstName: 'Michael',
      LastName: 'Schmidt',
      LastLogin: new Date(),
      IsAdmin: false,
      IsDisabled: false
    },
    Location: {
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
    }
  }
];