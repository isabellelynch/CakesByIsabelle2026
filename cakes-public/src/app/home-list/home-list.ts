import { Component, signal } from '@angular/core';
import { PricePipe } from '../price-pipe';

export class Cake {
  _id!: string;
  name!: string;
  desc!: string;
  price!: number;
  tags!: string[];
}

@Component({
  imports: [PricePipe],
  selector: 'app-home-list',
  styleUrl: './home-list.css',
  templateUrl: './home-list.html',
})
export class HomeList {
  cakes: Cake[] = [
    { _id: 'c1', name: 'Chocolate Fudge Cake', desc: 'Three layers of dark chocolate sponge with fudge icing.', price: 25, tags: ['chocolate', 'serves 10'] },
    { _id: 'c2', name: 'Lemon Drizzle', desc: 'Zesty lemon loaf with a crunchy sugar glaze.', price: 12.5, tags: ['citrus', 'serves 6', 'vegetarian'] },
    { _id: 'c3', name: 'Raspberry Victoria Sponge', desc: 'Classic sponge with raspberry jam and fresh cream.', price: 18, tags: ['fruit', 'serves 8'] }
  ];
}