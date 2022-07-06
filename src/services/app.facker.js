const faker = require('faker')

faker.locale='es'

function getAllTest(){
    const arrayObjetos=[]
    for(let i=0;i<5;i++){
        arrayObjetos.push({name:faker.commerce.product(), price:faker.finance.amount(), img:faker.image.cats()})
    }
    return(arrayObjetos)
}

module.exports= {getAllTest}