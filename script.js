'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'John Samir',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, -25, 25],
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const loadingPage = document.querySelector('.loading');

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelLoginError = document.querySelector('.login--error');
const labelWormingMassege = document.querySelector('.worming__massege');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerLogin = document.querySelector('.login--card');
const containerWorming = document.querySelector('.worming');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnWormingClose = document.querySelector('.worming__close');
const confirmingCloseAccount = document.querySelector(
  '.woriming__confirmation'
);

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
setTimeout(() => {
  loadingPage.style.visibility = 'hidden';
}, 3000);
alert('Demo account => username: js , pin: 1111');
/////////////////////////////////////////////////
function displayDate() {
  const date = new Date();
  labelDate.textContent = `  ${
    date.getDay() < 10 ? '0' + date.getDay() : date.getDay()
  }-${
    date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
  }-${date.getFullYear()}`;
}
displayDate();

const displayMovements = function (account) {
  account.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}$</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const getUserName = function (accs) {
  accs.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .reduce((name, cur) => name + cur);
  });
};
getUserName(accounts);

const calcBalance = function (account) {
  account.balance = account.movements.reduce((mov, cur) => mov + cur);
  labelBalance.textContent = account.balance + '$';
  return account.balance;
};

const calcSummary = function (account) {
  const sumIn = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, sum) => acc + sum);
  const sumOut = account.movements
    .filter(mov => mov < 0)
    .filter(mov => mov < 0)
    .reduce((acc, sum) => acc + sum);

  labelSumIn.textContent = Math.abs(sumIn);
  labelSumOut.textContent = Math.abs(sumOut);
};

//////////////////////////////////
function worming(massege) {
  labelWormingMassege.textContent = massege;
  containerWorming.style.visibility = 'visible';
}

////  Events handlers
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    const userNick = currentAccount.owner.split(' ')[0];
    labelWelcome.textContent = `Welcome ${userNick}`;
    displayMovements(currentAccount);
    calcBalance(currentAccount);
    calcSummary(currentAccount);
    containerApp.style.opacity = 1;
    containerLogin.style.display = 'none';
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    labelLoginError.style.opacity = 0;
  } else {
    labelLoginError.style.opacity = 1;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciver = accounts.find(acc => acc.userName === inputTransferTo.value);

  if (
    amount > 0 &&
    reciver &&
    currentAccount.balance >= amount &&
    reciver?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    reciver.movements.push(amount);
    displayMovements(currentAccount);
    calcBalance(currentAccount);
    calcSummary(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
  } else if (amount > currentAccount.balance) {
    confirmingCloseAccount.style.display = 'none';
    worming('Sorry! Your balance is not enough');
  } else if (reciver.userName === currentAccount.userName) {
    confirmingCloseAccount.style.display = 'none';
    worming('Not allowed to transfer amount to yourself !');
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    currentAccount.movements.push(amount);
    displayMovements(currentAccount);
    calcBalance(currentAccount);
    calcSummary(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    confirmingCloseAccount.style.display = 'flex';
    worming('Are you sure that you want to close you account with us ?');
  }
});

btnWormingClose.addEventListener('click', e => {
  e.preventDefault();

  containerWorming.style.visibility = 'hidden';
});
confirmingCloseAccount.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const accountIndex = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(accountIndex, 1);
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Login';
    setTimeout(() => (containerLogin.style.display = 'block'), 1000);
  }
  containerWorming.style.visibility = 'hidden';
});
