const mongoose = require('mongoose');
const IncomeExpenseSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    method:{
        type: String,
        required:true
    },
});
module.exports = mongoose.model('IncomeExpense',IncomeExpenseSchema);