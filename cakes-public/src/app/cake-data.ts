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

@Service()
export class CakeData {
  private http = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:3000/api';

  public async getCakes(): Promise<Cake[]> {
    const url = `${this.apiBaseUrl}/cakes`;
    return firstValueFrom(this.http.get<Cake[]>(url));
  }
}