const max=req.query.cant || 100000000
    const repeticiones = []
    for (let i = 0; i < max; i++) {
        repeticiones.push({id:(Math.floor(Math.random() * (1000 - 1)) + 0)})
    }
    
    function calcularRepeticiones() {
        repeticiones.forEach(e => {
            let id = e.id
            let result = repeticiones.filter((e => e.id == id))
            e.valor = result.length
        })
    }
    
calcularRepeticiones()
process.send(repeticiones)


