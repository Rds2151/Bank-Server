const express = require("express");
const ejs = require("ejs");
const app = express();
const { BankServer, getAccount } = require("./server")
const bodyparser = require("body-parser");
const { validateAddAccount , validateSendMoney } = require("./validate");

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));

// Render to the Home page

app.get("/", (req, res) => {
    res.render("index");
});

// Add new Account into the Bank Server

app.post("/api/addAccount", (req, res) => {
    const accountName = req.body.accountName
    const accountNumber = parseInt(req.body.accountNumber)
    const accountType = req.body.accountType
    const balance = parseInt(req.body.balance)

    let result = validateAddAccount(accountName,accountNumber,balance)

    if(!result) {
        let Account = {
            AccountName: accountName,
            AccountNumber: accountNumber,
            AccountType: accountType,
            Balance: balance,
        };
        BankServer.push(Account);
        result = "Account created successfully!"
    }

    res.render("index", {flag : "addAccount", message: result });
});

// Send Money

app.post("/api/sendMoney", (req,res) => {
    const senderNumber = parseInt(req.body.senderNumber);
    const receiverNumber = parseInt(req.body.receiverNumber);
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
    const accountNumber = parseInt(req.body.accountNumber)
    const Account = getAccount(accountNumber);

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
    const accountNumber = parseInt(req.body.accountNumber)
    const account = getAccount(accountNumber);
    let message;

    if (!account) {
        message = `No account found with Account Number: ${req.body.accountNumber}`
    } else {
        const index = BankServer.indexOf(account);
        BankServer.splice(index,1);
        message = `Account with Account Number ${req.body.accountNumber} deleted successfully`
    }
    
    res.render("index", { flag: "deleteAccount", message: message });
});

// Listening on Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on the port ${port}....`));