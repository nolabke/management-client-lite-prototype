import { formatDate } from '@angular/common';

/* eslint-disable @typescript-eslint/naming-convention */
export class LogEntry {

    public Id!: number;
    public Date!: Date | null;
    public Type!: string | null;
    public Controller!: string | null;
    public User!: string | null;
    public Message!: string | null;
/*
    get LogEntryDate(): string {
        if (this.Date === null ||
            this.Date === undefined) {
            return '';
        }

        const dateToDisplay = new Date(this.Date);
        const format = 'dd.MM.yyyy';
        const locale = 'en-US';
        const d = formatDate(dateToDisplay, format, locale);
        console.log(d);

        return d;
        
    }
    */
}
