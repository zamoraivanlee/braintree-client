import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BraintreeService, TestCard } from '../braintree/braintree.service';

@Component({
  selector: 'app-test-card-list',
  templateUrl: './test-card-list.component.html',
  styleUrls: ['./test-card-list.component.sass']
})
export class TestCardListComponent {
  cards: TestCard[] = []

  constructor(
    private braintreeService: BraintreeService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getTestCards()
  }

  getTestCards() {
    this.braintreeService.getTestCards().subscribe({
      next: (cards) => this.cards = cards,
      error: (response: HttpErrorResponse) => this.openSnackBar(response.error.title || response.message)
    })
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 5000 })
  }
}
