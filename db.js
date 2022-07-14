const mongoose= require('mongoose')
const { MONGODB_URI }= require('./config.js')

const connectDB=async ()=>{
    try{const db=await mongoose.connect(MONGODB_URI)
    console.log(`DB id connected ${db.connection.name}`)
    }catch(err){ console.error(err)}
}

module.exports = {connectDB}