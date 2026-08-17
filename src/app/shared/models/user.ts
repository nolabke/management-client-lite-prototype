export class User {

        public Id: number;
        public UserName: string | null;
        public Password: string | null;
        public FirstName: string | null;
        public LastName: string | null;
        public LastLogin: Date | null;
        public IsAdmin: boolean | null;
        public IsDisabled: boolean | null;
    
       // public Images: ApiImage[] = [];

       constructor(){
        this.Id = 0;
        this.UserName = '',
        this.Password = '';
        this.FirstName = '';
        this.LastName ='';
        this.LastLogin = new Date();
        this.IsAdmin = false;
        this.IsDisabled  = false;
       }    
        
}
