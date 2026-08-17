import { Project } from "./project";

export class StorageManager {
    
    public LastUserName: string | '' | undefined;
    public LastLoginDate!: Date | null;
    public LastLocation: Project | null = new Project;
    public Token: string | '' | undefined;
    public ServerAddress!: string | '';
    public IsLoggedIn: boolean | null = false;
    
    constructor (lastUserName : string, token: string, ){

    }
}
