class Cont {
  constructor() {
    // constant attributes
    this.bets = [2, 3, 5];

    // variable attributes
    this.leaving_hands = 2;
    this.shoe = [];
    this.bet_index = 0;
    this.vertical = false;
    this.prediction = null;
    this.bet = null;
  }

  predict() {
    // leaving
    this.prediction = null;
    this.bet = null;

    // predicting
    if (this.leaving_hands === 0) {
      // starting vertical
      if (this.shoe.length == 2 && this.shoe[0] === this.shoe[1]) {
        this.vertical = true;
      }
      this.prediction = this.vertical
        ? this.shoe[this.shoe.length - 1]
        : this.shoe[this.shoe.length - 1] ^ 1;
      this.bet = this.bets[Math.min(this.bet_index++, this.bets.length - 1)];
    }
  }

  validate(actual_hand) {
    // predicting
    if (this.leaving_hands === 0) {
      // losing
      if (this.prediction !== actual_hand) {
        this.bet_index = 0;
        this.vertical = !this.vertical;
      }
    }
    // leaving
    else {
      this.leaving_hands--;
    }

    // updating shoe array
    this.shoe.push(actual_hand);
  }

  str() {
    // returning string representation of cont
    return `Shoe: ${this.shoe}\n  Prediction: ${this.prediction}\n  Bet: ${this.bet}\nLi: ${this.leaving_hands} | Bi: ${this.bet_index}`;
  }
}

export { Cont };
