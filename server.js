const mongoose = require('mongoose');
const MONGODB_URL = 'mongodb+srv://white3332:white3332@cluster0.yivknnw.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URL, {useNewUrlParser: ture}, (err)=>{
    if (err){
        console.log(err);
    }else {
        console.log('connected to database succesfully');
    }
})


