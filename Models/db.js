const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/crud')
.then(()=>{
    console.log("mongodb is connected")
})
.catch((err)=>{
console.log("mongodb is not connected",err)
})