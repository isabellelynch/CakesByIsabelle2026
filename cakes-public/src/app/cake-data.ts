import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export class Cake {
  _id!: string;
  name!: string;
  desc!: string;
  price!: number;
  tags?: string[];
}

export class Order {
  _id!: string;
  email!: string;
  cake!: Cake | null;
  price!: number;
  status!: 'pending' | 'baking' | 'ready' | 'delivered' | 'cancelled';
  orderDate!: string;
  deliveryDate!: string;
}

@Service()
export class CakeData {
  private http = inject(HttpClient);
  private apiBaseUrl = '/api';

  public async getCakes(): Promise<Cake[]> {
    const url = `${this.apiBaseUrl}/cakes`;
    return firstValueFrom(this.http.get<Cake[]>(url));
  }

  public async getOrders(): Promise<Order[]> {
    const url = `${this.apiBaseUrl}/orders`;
    return firstValueFrom(this.http.get<Order[]>(url));
  }
}
