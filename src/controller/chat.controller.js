const Mensaje = require('../model/chat.js')
const {normalize, schema}= require('normalizr')

const authorSchema= new schema.Entity('authors')
const mensajeSchema= new schema.Entity('mensajes')

const messageSchema=new schema.Entity('messages',{
    author: authorSchema,
    mensaje: mensajeSchema
})

const messageArray= new schema.Array(messageSchema)

async function getAllChats(){
    try{
        const db=await Mensaje.find()          
        const normalizaMessage=normalize(db, messageArray) 
        //console.log(normalizaMessage)       
        return normalizaMessage
    }catch(err){err=>console.error(err)}
}

async function addChat(data){
    const mensaje=new Mensaje(data)
    return await mensaje.save()
}
getAllChats()

module.exports={
    getAllChats,
    addChat
}
