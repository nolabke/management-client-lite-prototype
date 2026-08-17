import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchFilter' })
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string | undefined): any[] {
    if (!items || !searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item => JSON.stringify(item).toLowerCase().includes(term));
  }
}
