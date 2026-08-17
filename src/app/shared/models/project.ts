import { ApiImage } from "./api-image";

export class Project {
    [x: string]: any;
    
    public Id!: number;
    public ProjectNo!: string | '';
    public Name: string | '';
    public Street: string | '';
    public Zip: string | '';
    public City: string | '';
    public Latitude: number | 0;
    public Longitude: number | 0;
    public IsDisabled!: boolean | null;

    public Images: ApiImage[] = [];

    constructor() {
        this.ProjectNo = '';
        this.Name = '';
        this.Street = '';
        this.Zip = '';
        this.City = '';
        this.Latitude = 0;
        this.Longitude = 0;
    }
}
