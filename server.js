const BankServer = [
    {
        AccountName: "Raj",
        AccountNumber: 1,
        AccountType: "Current",
        Balance: 120000000,
    },
    {
        AccountName: "Nitin",
        AccountNumber: 2,
        AccountType: "Savings",
        Balance: 2000000,
    }
];

const getAccount = function (accountNumber) {
    return BankServer.find((acc) => acc.AccountNumber === accountNumber);
}

module.exports = { BankServer, getAccount };
