const { options } = require ("../../options/mariaDB.js")
const knex = require ("knex")(options)

const add = async (product)=>{
    try{
        await knex("products").insert(product)
    }catch(err){
        console.log(err.message)
    }finally{
        console.log("destroy")
    }
}

const getAll= async ()=>{
    try{
        let data = await knex.from("products").select("*")
        let result = Object.values(JSON.parse(JSON.stringify(data)))
        return result
    }catch(err){
        console.error(err.message)        
    }finally{
        console.log("destroy")
    }
}

module.exports={
    add,
    getAll
}
