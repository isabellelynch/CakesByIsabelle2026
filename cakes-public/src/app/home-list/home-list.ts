import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { PricePipe } from '../price-pipe';
import { CakeData, Cake } from '../cake-data';

@Component({
  imports: [PricePipe],
  selector: 'app-home-list',
  styleUrl: './home-list.css',
  templateUrl: './home-list.html',
})
export class HomeList implements OnInit {
  private cakeData = inject(CakeData);
  private cdr = inject(ChangeDetectorRef);

  cakes: Cake[] = [];

  private async getCakes(): Promise<void> {
    try {
      this.cakes = await this.cakeData.getCakes();
      console.log('Fetched cakes:', this.cakes);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error fetching cakes:', error);
    }
  }

  ngOnInit(): void {
    this.getCakes();
  }
}