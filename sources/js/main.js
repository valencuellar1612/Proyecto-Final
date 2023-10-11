async function getApi() {
    const base_url= 'https://ecommercebackend.fundamentos-29.repl.co/';
    try{
        const data= await fetch(base_url);
        const res= await (data).json();
        localStorage.setItem('products', JSON.stringify(res));
    return res;
    }
    catch (error) {
        console.log(error),'ha ocurrido un problema';
    }
}
async function dataBase () {
    const db= {
        products: JSON.parse(localStorage.getItem(('products'))) || await getApi() ,
        cart: JSON.parse(localStorage.getItem('cart'))||{},
    }
    return(db)
}
function cartHandles () {
    const btn= document.querySelector(".cart__btn");
    const cartModal= document.querySelector(".cart__modal");
    const closeCart=document.querySelector('.close__button');
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active')
    })
    btn.addEventListener('click', function() {
        cartModal.classList.toggle("active")
    })
}
function printProducts (products) {
    const print= document.querySelector('.products');
    let html =''
    for (const item of products) {
        const {image, id, category, price, quantity}= item
        print.innerHTML= html;
        html +=`
        <div id="${id}" class="product">
            <figure class="product__img if${quantity}">
                <img src="${image}" alt="">
            </figure>
            <p class="product__description">
                <span>Categoria: </span>${category}<br>
                <span>Precio: </span>${price} USD<br>
                <span>Cantidad: </span>${quantity} Units<br>
            </p>
            <div class="product__buttons">
                <button class="btn__view">Ver detalle</button>
                <button class="btn__add">Agregar al carrito</button>
            </div></div>
        </div>`
    }
}
function addToCart(db) {
    const add= document.querySelector('.products');
    add.addEventListener('click', (event)=>{
            if ((event.target.classList.contains('btn__add'))){
            const id= +event.target.closest('.product').id;
            const article= db.products.find(element => element.id===id);
            if (article.quantity===0) {
                return alert ('este articulo se encuentra agotado');
            }
            if (article.id in db.cart) {
                if (db.cart[id].amount===db.cart[id].quantity) {
                    return alert ('el producto no se encuentra en existencia')}
                db.cart[article.id].amount+=1;
            } else {
                article.amount=1;
                db.cart[article.id]=article;
            }
            localStorage.setItem('cart', JSON.stringify(db.cart));
        }printCart(db.cart);
        printTotals(db)
    })
}
function printCart (products) {
    const print= document.querySelector('.cart__products');
    let html= '';
    for (const key in products) {
        const {image, id, category, price, quantity, amount}= products[key];
        html+=`
        <div id="${id}" class="cart__product">
            <figure class="cart__product__img">
                <img src="${image}" alt="image product">
            </figure>
            <div class="cart__product__container">
                <p class="cart__product__description">
                    <span>Categoria:</span> ${category}<br>
                    <span>precio:</span> $${price} USD<br>
                    <span>Cantidad:</span> ${quantity} Units<br>
                </p>
                <div class="cart__product__buttons">
                    <ion-icon class="less" name="remove-circle-outline"></ion-icon>
                    <span>${amount}</span>
                    <ion-icon class="plus" name="add-circle-outline"></ion-icon>
                    <ion-icon class="trash" name="trash-outline"></ion-icon>
                </div>
            </div>
        </div>
        `;
    }
    print.innerHTML=html;
}
function handleCart (db) {
    const cart= document.querySelector('.cart__products')
    cart.addEventListener('click', (event) => {
        if (event.target.classList.contains('less')) {
            const id= +(event.target.closest('.cart__product').id);
            if (db.cart[id].amount===1){
                return alert ('Uno, es la cantidad minima que puedes comprar')    
            }
            db.cart[id].amount--;
        }
        if (event.target.classList.contains('plus')) {
            const id= +(event.target.closest('.cart__product').id);
            if (db.cart[id].amount===db.cart[id].quantity) {
                return alert('El producto no se encuentra en existencia')    
            }
            db.cart[id].amount++;
        } 
        if (event.target.classList.contains('trash')){
            const id= +(event.target.closest('.cart__product').id);
            const response= confirm('¿Esta seguro que desea retirar el producto?');
                if (response) {
                delete db.cart[id];
                }
                else {
                    return;   
            }
        }
    localStorage.setItem('cart', JSON.stringify(db.cart));
    printCart(db.cart);
    printTotals(db); 
    })
}
function printTotals(db) {
    const cartTotal=document.querySelector('.cart__totals div');
    const cartIcon=document.querySelector('.cart__btn span');
    let objects=0
    let totals= 0
    for (const key in db.cart) {
        const{price, amount}= db.cart[key];
        objects+= amount;
        totals+= price*amount;
    }
    let html=`
    <p><span>Cantidad:</span> ${objects}</p>
        <p><span>Total:</span> ${totals} USD</p>`;
    cartTotal.innerHTML=html;
    cartIcon.innerHTML = objects;
}
function handlesTotals(db) {
    const totals=document.querySelector('.cart__total__button')
    totals.addEventListener('click', () =>{
        if (!(Object.values(db.cart).length)) {
            return alert ('Debes agregar productos antes de realizar una compra')
        }
        const response= confirm ('¿Estas seguro de realizar esta compra?');
        if (!response) {
            return;
        }
        for (const key in db.cart) {
            if ( db.cart[key].id===db.products[key-1].id) {
                db.products[key-1].quantity-=db.cart[key].amount
            }
        }
        db.cart={};
        localStorage.setItem('products', JSON.stringify(db.products));
        localStorage.setItem('cart', JSON.stringify(db.cart))
        printProducts(db.products);
        printCart(db.cart);
        printTotals(db);
        alert ('Gracias por su compra');
    }) 
}
function filterProducts(products) {
        const list= document.querySelectorAll('.options__list')
        list.forEach(option => {    
            option.addEventListener('change', ()=> {
                const selectedValue= option.value   
                if (selectedValue==='todos') {
                    printProducts(products);   
                }
                else if (selectedValue==='shirts') {
                    const shirts = products.filter(element=>(element.category==='shirt'));
                    printProducts(shirts);
                }
                else if  (selectedValue==='sweaters')  {
                    const sweaters=products.filter(element=> element.category==='sweater');
                    printProducts(sweaters);
                }
                else if  (selectedValue==='hoddies')  {
                    const hoddies=products.filter(element=> element.category==='hoddie');
                    printProducts(hoddies);
                }
            })
        })
    }
function showDetails (products){
        const readBtn = document.querySelector('.products');
        const showModal = document.querySelector('.view__modal');
        const closeModal = document.querySelector('.close__modal');
        const contentModal= document.querySelector('.content__modal')
        readBtn.addEventListener('click', (event)=> {
            if (event.target.classList.contains('btn__view')) {
                const id = +event.target.closest('.product').id
                const article = products.find(element => element.id == id)
                const { category, description, image, name, price, quantity} = article
                let html = `
                    <div class="modal__product">
                        <figure class="modal__product__img">
                            <img src="${image}" alt="image product">
                        </figure>
                        <p class="modal__product__short">
                            <span>Categoria:</span> ${category}<br>
                            <span>Precio:</span> $${price} USD<br>
                            <span>Cantidad:</span> ${quantity} Units<br>
                        </p>
                    </div>
                    <p class="modal__product__long">
                        <span>Nombre:</span> ${name}<br>
                        <span>Descripción:</span> ${description}<br>
                    </p>`;
                    contentModal.innerHTML = html;
                showModal.classList.add('active')
            }
        })
        closeModal.addEventListener('click', ()=>{
            showModal.classList.remove('active')
        })
}
async function main() {
    const db = await dataBase();
    cartHandles();
    printProducts(db.products);
    addToCart(db);
    printCart(db.cart);
    handleCart(db);
    printTotals(db)
    handlesTotals(db);
    filterProducts(db.products);
    showDetails (db.products);
}   
main();


    