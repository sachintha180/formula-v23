class Side {
  constructor(max_leaving_hands) {
    // constant attributes
    this.max_leaving_hands = max_leaving_hands;
    this.bets = [1, 2, 2];

    // variable attributes
    this.leaving_hands = max_leaving_hands;
    this.shoe = [];
    this.bet_index = 0;
    this.prediction = null;
    this.bet = null;
  }

  predict() {
    // leaving
    this.prediction = null;
    this.bet = null;

    // predicting
    if (this.leaving_hands === 0) {
      this.prediction = this.shoe[this.shoe.length - 2] ^ 1;
      this.bet = this.bets[this.bet_index++ % this.bets.length];
    }
  }

  validate(actual_hand) {
    // predicting
    if (this.leaving_hands === 0) {
      // winning or reaching end
      if (
        this.prediction === actual_hand ||
        this.bet_index === this.bets.length
      ) {
        this.max_leaving_hands++;
        this.leaving_hands = this.max_leaving_hands;
        this.bet_index = 0;
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
    // returning string representation of side
    return `Shoe: ${this.shoe}\n  Prediction: ${this.prediction}\n  Bet: ${this.bet}\nLi: ${this.leaving_hands} | Bi: ${this.bet_index}`;
  }
}

export { Side };
