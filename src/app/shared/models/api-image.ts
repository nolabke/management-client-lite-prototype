import { v4 as UUIDv4} from 'uuid'
import { decode } from 'base64-arraybuffer';
import { formatDate } from '@angular/common';
import { User } from './user';
import { Project } from './project';

/* eslint-disable @typescript-eslint/naming-convention */
export class ApiImage {

    public Id!: number;
    public Uuid!: string;
    public Name!: string | null;
    public FileName!: string | null;

    public Base64!: string | null;
    public Format!: string | 'jpeg';
    public Blob!: Blob | null;
    public Url!: string | null;
    public IsSynced!: number; //added
    public LocationId!: number;
    public UploadDate!: Date;
    public User: User = new User();
    public Location: Project = new Project();
  this: any;

    public static createApiImage(base64String: string, format: string): ApiImage{
        const apiImage = new ApiImage();
        apiImage.Base64 = base64String;
        apiImage.Format = format;
        apiImage.Uuid = UUIDv4();

        return apiImage;
    }

    public static convertFromStorage(imageData: any): ApiImage{
        const apiImage = new ApiImage();
        apiImage.Base64 = imageData.Base64;
        apiImage.Format = imageData.Format;
        apiImage.Uuid = imageData.Uuid;

        return apiImage;
    }

    private static convertBlobToBase64 = (blob : any) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

    public async toBase64(): Promise<string> {
        return (await ApiImage.convertBlobToBase64(this.Blob)) as string;
    }

    public toDataUrl(): string {
        return `data:image/${this.Format};base64,${this.Base64}`;
    }

    public toBlob(): Blob {
        return new Blob([new Uint8Array(decode(this.Base64 === null ? '' : this.Base64))], {
          type: `image/${this.Format}`,
        });
    }

    public toFile(name: string): File {
        const blob = this.toBlob();
        return new File([blob], name, {
            type: blob.type,
        });
    }

    get UploadDateString(): string {
        if (this.UploadDate === null ||
            this.UploadDate === undefined) {
            return '';
        }

        const dateToDisplay = new Date(this.UploadDate);
        const format = 'dd.MM.yyyy HH:mm';
        const locale = 'en-US';
        return formatDate(dateToDisplay, format, locale);
    }
    
}
