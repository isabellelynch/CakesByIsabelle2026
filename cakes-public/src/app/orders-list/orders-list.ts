import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PricePipe } from '../price-pipe';
import { CakeData, Order } from '../cake-data';

@Component({
  imports: [PricePipe, DatePipe],
  selector: 'app-orders-list',
  styleUrl: './orders-list.css',
  templateUrl: './orders-list.html',
})
export class OrdersList implements OnInit {
  private cakeData = inject(CakeData);
  private cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  loading = true;
  message = '';           // shown instead of the list if something goes wrong

  // Label and Bootstrap colour for each order status
  statusLabel: Record<string, string> = {
    pending: 'Order received',
    baking: 'Baking',
    ready: 'Ready for pickup',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  statusClass: Record<string, string> = {
    pending: 'bg-secondary-subtle text-secondary-emphasis',
    baking: 'bg-warning-subtle text-warning-emphasis',
    ready: 'price-badge',
    delivered: 'bg-success-subtle text-success-emphasis',
    cancelled: 'bg-danger-subtle text-danger-emphasis'
  };

  private async getOrders(): Promise<void> {
    try {
      this.orders = await this.cakeData.getOrders();
      console.log('Fetched orders:', this.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.message = 'Your session has ended. Please log in again.';
      } else {
        this.message = 'Sorry, we could not load your orders. Please try again.';
      }
    }
    this.loading = false;
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getOrders();
  }
}
