const cards= document.getElementById("cards");
const footer= document.querySelector("#footer");
const items=document.querySelector("#items");

const templateCards=document.querySelector("#template-card").content;
const templateFooter=document.getElementById("template-footer").content;
const templateCarrito=document.querySelector("#template-carrito").content;

const fragment =document.createDocumentFragment();
let carrito={};
// 2se inicia el evento para obetener los datos, ejecutando la funcion //
document.addEventListener("DOMContentLoaded", ()=>{
    fetchData();
   
})
document.addEventListener('click', e =>{
    addCarrito(e);
})
//genera un evecto que tiene una funcion dentro, para darle funcionalidad al boton + y -//
items.addEventListener('click',e=>{
    accionarBotones(e)
})
//1capturamos los datos de la API//
const fetchData= async()=>{
    try {
        const respuesta= await fetch("api.json");
        const data= await respuesta.json();
        pintarTarjetas(data);
    } catch (error) {
        console.log(error);
    }
}
 // 3 se imprime y se clonan las tajetas//
const pintarTarjetas= data =>{
    data.forEach(producto => {
      templateCards.querySelector("h5").textContent= producto.title;
      templateCards.querySelector("p").textContent=producto.precio;
      templateCards.querySelector("img").setAttribute("src", producto.thumbnailUrl);
      templateCards.querySelector(".btn-dark").dataset.id=producto.id;
      const clone= templateCards.cloneNode(true);
      fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}
//funcion para capturar los elementos HTML//
const addCarrito = (e =>{
    if (e.target.classList.contains("btn-dark")){
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
})

const setCarrito= objeto =>{
    const producto={
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        precio: objeto.querySelector("p").textContent,
        cantidad: 1
    };
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad= carrito[producto.id].cantidad+1;
    }
    carrito[producto.id]={...producto};
    pintarCarrito();
};
//agregamos los prodcutos con sus caracteristicas al carrito//
const pintarCarrito =()=> {
    items.innerHTML=""; // se usa para limpiar el html//
    Object.values(carrito).forEach (producto =>{
        templateCarrito.querySelector("th").textContent= producto.id;
        templateCarrito.querySelectorAll("td")[0].textContent=producto.title;
        templateCarrito.querySelectorAll("td")[1].textContent=producto.cantidad;
        templateCarrito.querySelector(".btn-info").dataset.id=producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id=producto.id;
        templateCarrito.querySelector("span").textContent=producto.precio*producto.cantidad;

        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone);

    });
    items.appendChild(fragment);
    pintarFooter();
};
//imprimimos el footer del carrito,  (total a pagar y borrar productos)//
const pintarFooter=()=>{
    footer.innerHTML="";
    if (Object.keys(carrito).length===0){
        
        footer.innerHTML= `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
        return 
    }
    
    const ncantidad= Object.values(carrito).reduce((contador,{cantidad})=> contador+ cantidad,0);
    const precioTotal=Object.values(carrito).reduce((sumador, {cantidad,precio})=> sumador+(precio*cantidad),0);
    templateFooter.querySelectorAll("td")[0].textContent=ncantidad;
    templateFooter.querySelector("span").textContent=precioTotal;
    const clone= templateFooter.cloneNode(true);
    console.log(clone)
    fragment.appendChild(clone);
    footer.appendChild(fragment);
    const btnEliminar = document.querySelector("#vaciar-carrito");
    btnEliminar.addEventListener('click',()=>{
        carrito={}
        pintarCarrito()
    })
}

const accionarBotones= e=>{
    //accion de aumenar//
    if (e.target.classList.contains("btn-info")){
            const producto=carrito[e.target.dataset.id];
           producto.cantidad++;
           carrito[e.target.dataset.id]={...producto};
           pintarCarrito();
    }
    if (e.target.classList.contains("btn-danger")){
        const producto=carrito[e.target.dataset.id];
        if (producto.cantidad>0)
            producto.cantidad--;
        if (producto.cantidad===0)
        delete carrito[e.target.dataset.id];
       
        pintarCarrito();
}

e.stopPropagation();

}





