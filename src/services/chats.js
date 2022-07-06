const { options } = require ("../../options/sqliteDB.js")
const knex = require ("knex")(options)

const addChat = async (chat)=>{
    try{
        await knex("chats").insert(chat)
    }catch(err){
        console.log(err)
    }finally{
        //knex.destroy()
    }
}

const getAllChats= async ()=>{
    try{
        return await knex.from("chats").select("*")
    }catch(err){
        console.log(err)        
    }finally{
        //knex.destroy()
    }
}

module.exports={
    addChat,
    getAllChats
}
