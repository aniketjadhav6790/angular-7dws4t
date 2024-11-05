import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Train Seat Reservation System';

  // Initialize seat availability
  seats: boolean[] = Array(80).fill(false);
  bookedSeats: number[] = [5, 15, 30]; // Pre-booked seats for demonstration
  reservedSeats: number[] = [];
  requestedSeats: number = 0; // User input for requested seats
  message: string = '';

  constructor() {
    // Mark already booked seats as true
    for (let seat of this.bookedSeats) {
      this.seats[seat - 1] = true; // Mark seat as booked
    }
  }

  // Function to reserve seats
  reserveSeats(requestedSeats: number): void {
    if (requestedSeats < 1 || requestedSeats > 7) {
      this.message = 'Please request between 1 to 7 seats.';
      return;
    }

    const availableSeats = this.findAvailableSeats(requestedSeats);

    if (availableSeats.length > 0) {
      this.bookedSeats.push(...availableSeats);
      for (let seat of availableSeats) {
        this.seats[seat - 1] = true; // Mark seat as booked
      }
      this.reservedSeats = availableSeats;
      this.message = `Seats booked: ${availableSeats.join(', ')}`;
    } else {
      this.message = 'Not enough seats available!';
    }
  }

  // Function to find available seats
  findAvailableSeats(requestedSeats: number): number[] {
    let result: number[] = [];
    let count = 0;

    // Iterate through rows of 7 seats
    for (let i = 0; i < 11; i++) {
      const start = i * 7; // Start of the row
      const rowSeats = this.seats.slice(start, start + (i === 10 ? 3 : 7));

      // Check for contiguous available seats
      for (let j = 0; j < rowSeats.length; j++) {
        if (!rowSeats[j]) {
          count++;
          if (count === requestedSeats) {
            for (let k = j - requestedSeats + 1; k <= j; k++) {
              result.push(start + k + 1); // Seat numbers are 1-indexed
            }
            return result;
          }
        } else {
          count = 0; // Reset count if a seat is booked
        }
      }
    }

    // If not found in rows, look for nearby seats
    return this.findNearbySeats(requestedSeats);
  }

  // Function to find nearby available seats
  findNearbySeats(requestedSeats: number): number[] {
    let result: number[] = [];
    let count = 0;

    // Check all seats for availability
    for (let i = 0; i < this.seats.length; i++) {
      if (!this.seats[i]) {
        count++;
        result.push(i + 1); // Seat numbers are 1-indexed
        if (count === requestedSeats) {
          return result;
        }
      }
    }

    return []; // Return empty if not enough nearby seats
  }
}
