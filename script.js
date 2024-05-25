import { Cont } from "./cont.js";
import { Side } from "./side.js";

// intialize global variables
let shoe = [];
let sides = [new Side(2), new Cont()];
let prediction = null;
let bet = null;
let total = 0;

// initialize global DOM elements
let instruction_lbl;
let total_lbl;
let hand_count_lbl;
let leaving_div;
let prediction_div;
let banker_btn;
let player_btn;
let win_btn;
let lose_btn;
let shoe_tbl;
let calc_tbl;

const init = () => {
  // label initializations
  instruction_lbl = document.querySelector("#instruction");
  total_lbl = document.querySelector("#total");
  hand_count_lbl = document.querySelector("#hand");

  // container initializations
  leaving_div = document.querySelector("#leaving");
  prediction_div = document.querySelector("#prediction");

  // button initializations
  banker_btn = document.querySelector("#banker");
  player_btn = document.querySelector("#player");
  win_btn = document.querySelector("#win");
  lose_btn = document.querySelector("#lose");

  // table initializations
  shoe_tbl = document.querySelector("#shoe tr");
  calc_tbl = document.querySelector("#calc");

  // add leaving button event listeners
  banker_btn.addEventListener("click", () => {
    validate(0);
  });

  player_btn.addEventListener("click", () => {
    validate(1);
  });

  // add predicting button event listeners
  win_btn.addEventListener("click", () => {
    validate(prediction);
  });

  lose_btn.addEventListener("click", () => {
    validate(prediction ^ 1);
  });

  // call intial predict
  predict();
};

const combine = () => {
  // accumulate individual bets (number | null)
  let bet = 0;
  for (let side of sides) {
    side.predict();
    if (side.prediction !== null) {
      bet = side.prediction === 0 ? bet + side.bet : bet - side.bet;
    }
  }

  // calculate final prediction and bet
  let prediction = null;
  if (bet) {
    prediction = bet > 0 ? 0 : 1;
  }

  // return final prediction and bet
  return [prediction, bet ? Math.abs(bet) : null];
};

const predict = () => {
  // get combined prediction and bet
  [prediction, bet] = combine();

  if (prediction !== null) {
    // show prediction container
    leaving_div.classList.add("is-hidden");
    prediction_div.classList.remove("is-hidden");

    // update instruction label
    instruction_lbl.innerHTML = `Bet ${bet} for ${
      prediction == 0 ? "Banker" : "Player"
    }`;
  } else {
    // show leaving container
    leaving_div.classList.remove("is-hidden");
    prediction_div.classList.add("is-hidden");

    // update instruction label
    instruction_lbl.innerHTML = "Leave one hand";
  }
};

const validate = (actual_hand) => {
  // predicting
  if (prediction !== null) {
    // win
    if (actual_hand === prediction) {
      total += bet;
      // lose
    } else {
      total -= bet;
    }
  }

  // validate + tabulate individual sides
  const side_row = document.createElement("tr");
  sides.forEach((side, index) => {
    side.validate(actual_hand);
    const side_element = document.createElement("td");
    if (side.prediction !== null) {
      side_element.innerHTML = `${actual_hand === side.prediction ? "+" : "-"}${
        side.bet
      }`;
    } else {
      side_element.innerHTML = "-";
    }
    if (index === sides.length - 1) {
      side_element.classList.add("is-warning");
    } else {
      side_element.classList.add("is-light");
    }
    side_row.appendChild(side_element);
  });

  // tabulate final prediction
  const final_element = document.createElement("td");
  final_element.classList.add("is-success");
  if (prediction !== null) {
    final_element.innerHTML = `${actual_hand === prediction ? "+" : "-"}${bet}`;
  } else {
    final_element.innerHTML = "-";
  }
  side_row.appendChild(final_element);
  calc_tbl.appendChild(side_row);

  // add hand to shoe
  shoe.push(actual_hand);

  // display total
  total_lbl.innerHTML = `Total: ${total}`;

  // display hand count
  hand_count_lbl.innerHTML = `Current Hand: ${shoe.length}`;

  // tabulate shoe
  const hand_item = document.createElement("td");
  if (shoe[shoe.length - 1] === 0) {
    hand_item.innerHTML = "B";
    hand_item.classList.add("is-danger");
  } else {
    hand_item.innerHTML = "P";
    hand_item.classList.add("is-info");
  }
  shoe_tbl.appendChild(hand_item);

  // prepare additional side
  const side = new Side(sides[sides.length - 2].max_leaving_hands + 1);
  side.leaving_hands -= sides.length - 1;

  // add side to sides list
  sides.splice(sides.length - 1, 0, side);

  // repeat predict
  predict();
};

window.onload = init;
