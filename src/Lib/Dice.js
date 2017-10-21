const Dice = {
  roll: (multiplier, dice) => {
    let result = 0;
    let random = () => {
      return Math.floor(Math.random() * dice) + 1;
    }
    for (var i = 0; i < multiplier; i++) {
      result += random();
    }

    return result;
  }
}

export default Dice
