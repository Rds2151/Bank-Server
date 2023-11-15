const express = require("express");
const ejs = require("ejs");
const app = express();
const bodyparser = require("body-parser");

const BankServer = [
    {
        AccountName: "Raj",
        AccountNumber: "1",
        AccountType: "Current",
        Balance: 120000000,
    },
    {
        AccountName: "Nitin",
        AccountNumber: "2",
        AccountType: "Savings",
        Balance: 2000000,
    }
];

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

// Render to the Home page

app.get("/", (req, res) => {
    res.render("index");
});

validateAddAccount = (accountName,accountNumber,balance) => {
    let message;
    if (getAccount(accountNumber)) {
        message = "Account creation failed. Account number already exists.";
    } else if (balance < 500) {
        message = "Account creation failed. Initial balance should be at least 500.";
    } else if (!/^[a-zA-Z\s]+$/.test(accountName)) {
        message = "Account name should only contain letters and spaces.";
    } else if (accountName.length < 3 || accountName.length > 50) {
        message = "Account name should be between 3 and 50 characters.";
    } else if (!/^[1-9]{1}[0-9]+$/.test(accountNumber)) {
        message = "Invalid account number. Please enter decimal number."
    }

    return message;
}

// Add new Account into the Bank Server

app.post("/api/addAccount", (req, res) => {
    const accountName = req.body.accountName
    const accountNumber = req.body.accountNumber
    const accountType = req.body.accountType
    const balance = req.body.balance

    let result = validateAddAccount(accountName,accountNumber,balance)

    if(!result) {
        let Account = {
            AccountName: accountName,
            AccountNumber: accountNumber,
            AccountType: accountType,
            Balance: parseInt(balance),
        };
        BankServer.push(Account);
        result = "Account created successfully!"
    }

    res.render("index", {flag : "addAccount", message: result });
});

getAccount = (accountNumber) => BankServer.find((acc) => acc.AccountNumber === accountNumber);

validateSendMoney = (senderNumber,receiverNumber,amount) => {
    const senderAccount = getAccount(senderNumber)
    let message;
    
    if (senderNumber === receiverNumber ) {
        message= "Sender and receiver account numbers cannot be the same."
    } else if(!senderAccount) {
        message = `No account found with Account Number: ${senderNumber}`
    } else if(!getAccount(receiverNumber)) {
        message = `No account found with Account Number: ${receiverNumber}`
    } else if (amount <= 0) {
        message = "Invalid amount. Please enter a positive value for the money transfer."
    } else if (senderAccount.Balance < parseInt(amount)) {
        message = "Transaction failed. Insufficient funds in the account."
    }
    
    return message;
}

// Send Money

app.post("/api/sendMoney", (req,res) => {
    const senderNumber = req.body.senderNumber;
    const receiverNumber = req.body.receiverNumber;
    const amount = req.body.amount;

    let result = validateSendMoney(senderNumber,receiverNumber,amount)

    if(!result) {
        const senderAccount = getAccount(senderNumber)
        const receiverAccount = getAccount(receiverNumber)
    
        senderAccount.Balance = senderAccount.Balance - parseInt(amount)
        receiverAccount.Balance += parseInt(amount) 
        result = "Transaction successful. Money sent."
    }

    res.render("index", { flag: "sendMoney",  message: result});
})

// View Specific Account Details

app.post("/api/viewAccount/", (req, res) => {
    const Account = getAccount(req.body.accountNumber);

    // Validation
    if (!Account) return res.render("index", { flag: "viewAccount",  message: `No account found with Account Number: ${req.body.accountNumber}`, account: Account });
    
    res.render("index", { flag: "viewAccount", account: Account });
});

// View All Accounts Details

app.get("/api/viewAllAccount", (req, res) => {
    if (BankServer.length === 0) return res.render("index", { flag: "viewAllAccount" });
    res.render("index", { flag: "viewAllAccount", data: BankServer });
});

// Delete Request

app.post("/api/deleteAccount/", (req, res) => {
    const account = getAccount(req.body.accountNumber);
    let message;

    if (!account) {
        message = `No account found with Account Number: ${req.body.accountNumber}`
    } else {
        const index = BankServer.indexOf(account);
        BankServer.splice(index);
        message = `Account with Account Number ${req.body.accountNumber} deleted successfully`
    }
    
    res.render("index", { flag: "deleteAccount", message: message });
});

// Listening on Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on the port ${port}....`));
