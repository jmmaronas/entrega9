const mongoose= require('mongoose')

const connectDB=async ()=>{
    try{const db=await mongoose.connect('mongodb://localhost:27017/chat')
    console.log(`DB id connected ${db.connection.name}`)
    }catch(err){ console.error(err)}
}

module.exports = {connectDB}