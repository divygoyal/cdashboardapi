const mongoose = require('mongoose');
const DB = process.env.DB;
try {
    const connected = mongoose.connect(DB);
    if(connected){
        console.log('connected')
    }
} catch (error) {
    console.log("error" , error);
}

