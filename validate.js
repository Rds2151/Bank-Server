const { getAccount } = require("./server")

exports.validateAddAccount = (accountName,accountNumber,balance) => {
    let message;
    if (getAccount(accountNumber)) {
        message = "Account creation failed. Account number already exists.";
    } else if (balance < 500) {
        message = "Account creation failed. Initial balance should be at least 500.";
    } else if (!/^[a-zA-Z\s]+$/.test(accountName)) {
        message = "Account name should only contain letters and spaces.";
    } else if (accountName.length < 3 || accountName.length > 50) {
        message = "Account name should be between 3 and 50 characters.";
    } else if (accountNumber === 0 || !/^[0-9]+$/.test(accountNumber)) {
        message = "Invalid account number. Please enter a valid decimal number.";
    }
    
    return message;
}

exports.validateSendMoney = (senderNumber,receiverNumber,amount) => {
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