let max = 100000000
const repeticiones = []
process.on('message', message =>{
    console.log(`El:${typeof message}`)
    max=Number(message)    
    for (let i = 0; i < max; i++) {
        repeticiones.push({ numero: (Math.floor(Math.random() * (1000 - 1)) + 0) })
    }    
    calcularRepeticiones()
    process.send(JSON.stringify(repeticiones))
})

function calcularRepeticiones() {
    repeticiones.forEach(e => {
        let numero = e.numero
        let result = repeticiones.filter((e => e.numero == numero))
        e.repeticiones = result.length
    })
}




