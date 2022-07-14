const {Schema, model}=require('mongoose')

const authorSchema= new Schema({
    id:{type:String, require:true, trim:true},
    nombre:{type:String, require:false, trim:true},
    apellido:{type:String, require:false, trim:true},
    edad:{type:Number, require:false, trim:true},
    alias:{type:String, require:false, trim:true},
    avatar:{type:String, require:false, trim:true}
})

const chatSchema= new Schema({
    author: authorSchema,
    mensaje:{ type:String , require:true, trim:true }
})

module.exports = model('Mensaje', chatSchema)