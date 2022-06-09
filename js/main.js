'use strict';

const products = [
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Mouse', price: 20 },
    { id: 3, title: 'Keyboard', price: 200 },
    { id: 4, title: 'Gamepad', price: 50 },
];

class ProductsItem {
    constructor({ title ='', price = 0}){
        this.title = title;
        this.price = price;
    }
    render() {
        return `<div class="product-item">
            <img class="product-item__img" src="./img/${this.title}.svg" alt="${this.title}">
            <h3>${this.title}</h3>
            <p>${this.price}</p>
            <button class="buy-btn">Купить</button>
        </div>`
    }
}

class ProductsList {
    constructor(list = []){
        this.list = list
    }
    render() {
        const productsList = this.list.map(item => {
            const productItem = new ProductsItem(item); 
            return productItem.render()}).join(' ');
            // renderProduct(item.title, item.price));
            document.querySelector('.products').innerHTML = productsList;
    }
    getSum(){
        return this.list.reduce((sum, item) => sum + item.price,0);
    }
}

const productsList = new ProductsList(products);
productsList.render()
console.log(productsList.getSum())
