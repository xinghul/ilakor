var CreditCard = require("credit-card");

console.log(CreditCard.validate({
  cardType: "visa",
  number: "4400668774948162"
}));