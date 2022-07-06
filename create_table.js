const {options}=require("./options/mariaDB.js")
const knex= require("knex")(options)

knex.schema.createTable("products",(table)=>{
    table.increments("id"),
    table.string("name"),
    table.integer("price")
    table.string("img")
})
    .then(()=>console.log("table created"))
    .catch((err)=>{console.log(err); throw err})
    .finally(()=>knex.destroy())

