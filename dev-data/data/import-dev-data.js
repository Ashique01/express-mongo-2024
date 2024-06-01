const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')
dotenv.config({ path: './config.env' });


const db = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
console.log(db);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importTours = async()=>{
    try{
        await Tour.create(tours)
        console.log('Data successfully loaded')
    }
    catch(err){
        console.log(err)
    }
    process.exit()
}

const deleteTour = async() =>{
    try{
        await Tour.deleteMany()
        console.log('Data successfully deleted')
        
    }
    catch(err){
        console.log(err)
    }   
    process.exit()
}

console.log(process.argv)
if(process.argv[2] === '--import'){
    importTours()
    
}
else if(process.argv[2] === '--delete'){
    deleteTour()
}