const { schema, denormalize } = normalizr


const authorSchema = new schema.Entity('author')
const mensajeSchema = new schema.Entity('mensaje')
const messageSchema = new schema.Entity('messages', {
    author: authorSchema,
    mensaje: mensajeSchema
})
const messageArray=new schema.Array(messageSchema)

const socket = io()

const id = document.getElementById("emailUsuario")
const usuarioNombre = document.getElementById("nombreUsuario")
const apellidoUsuario = document.getElementById("apellidoUsuario")
const aliasUsuario = document.getElementById("aliasUsuario")
const avatarUsuario = document.getElementById("avatarUsuario")
const edadUsuario = document.getElementById("edadUsuario")
const message = document.getElementById("message")

const btnMessage = document.getElementById("btnMessage")
const chatContainer = document.getElementById("chatContainer")

const registroTabla = document.getElementById("registroTabla")
const formProductos = document.getElementById("datosProductos")


socket.on("bienvenida", data => {
    console.log(data)
    const datos = denormalize(data.result, messageArray, data.entities)
    console.log(datos)
    datos.map(element => {
        chatContainer.innerHTML += `
        <div>
            <strong class="text-primary">${element.usuario}</strong><span class="text-danger">[${element.date}]</span>:
                <em class="text-success" >${element.mensaje}</em>
        </div>                
    `
    })
})

btnMessage.addEventListener("click", (e) => {
    console.log({ author: { id: id.value, nombre: nombreUsuario.value, apellido: apellidoUsuario.value, edad: edadUsuario.value, alias: aliasUsuario.value, avatar: avatarUsuario.value }, mensaje: message.value })
    socket.emit("mensajeCliente", { author: { id: id.value, nombre: nombreUsuario.value, apellido: apellidoUsuario.value, edad: edadUsuario.value, alias: aliasUsuario.value, avatar: avatarUsuario.value }, mensaje: message.value })
    message.value = ""
})

formProductos.addEventListener("submit", (e) => {
    e.preventDefault()
    let name = document.getElementById("nombreProducto").value
    let price = document.getElementById("precioProducto").value
    let img = document.getElementById("imgProducto").value
    socket.emit("newProduct", { name, price, img })
    e.target.reset()
})

socket.on("mensajeProvedor", data => {
    data.denormalize
    chatContainer.innerHTML += `
        <div>
            <strong class="text-primary">${data.usuario}</strong><span class="text-danger">[${data.date}]</span>:
                <em class="text-success" >${data.mensaje}</em>
        </div>                
    `
})

socket.on("bdProductos", data => {
    registroTabla.innerHTML = ""
    data.map(product => {
        registroTabla.innerHTML += `
        <tr>
            <td class="my-auto">${product.name}</td>
            <td class="my-auto">${product.price}</td>
            <td><img src="${product.img}" width="60px" height="40px"></td>
        </tr>
        `
    })
})