import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  transform(price: number | null | undefined): string {
    const _isNumeric = function (n: unknown): boolean {
      return !isNaN(parseFloat(n as string)) && isFinite(Number(n));
    };

    if (price != null && _isNumeric(price)) {
      let thisPrice = '';
      if (Number.isInteger(price)) {
        thisPrice = price.toString();
      } else {
        thisPrice = price.toFixed(2);
      }
      return `€${thisPrice}`;
    } else {
      return '?';
    }
  }
}