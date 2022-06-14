'use strict';

const products = [
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Mouse', price: 20 },
    { id: 3, title: 'Keyboard', price: 200 },
    { id: 4, title: 'Gamepad', price: 50 },
];

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const PRODUCTS = `${API}/catalogData.json`;
const BASKET = `${API}/getBasket.json`;

function service(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    const loadHandler = () => {
        callback(JSON.parse(xhr.response));
    }
    xhr.onload = loadHandler;
    xhr.send();
}

class ProductsItem {
    constructor({ product_name, price = 0 }) {
        this.title = product_name;
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
    items = [];
    fetchProducts(callback) {
        service(PRODUCTS, (data) => {
            this.items = data
            callback()
        });
    }
    render() {
        const productsList = this.items.map(item => {
            const productItem = new ProductsItem(item);
            return productItem.render()
        }).join(' ');
        document.querySelector('.products').innerHTML = productsList;
    }
    getSum() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
}

class BasketProducts {
    items = [];
    fetchData() {
        service(BASKET, (data) => {
            this.items = data
        });
    }
}

const productsList = new ProductsList();
productsList.fetchProducts(() => {
    productsList.render();
});

const basketProducts = new BasketProducts();
basketProducts.fetchData();

