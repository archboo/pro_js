'use strict';

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const PRODUCTS = `${API}/catalogData.json`;
const BASKET = `${API}/getBasket.json`;

function service(url) {
    return fetch(url).then((res) => res.json())
}

window.onload = () => {

    Vue.component('product', {
        props: [
            'item'
        ],
        template: `
            <div class="product-item"">
                <h3>{{item.product_name}}</h3>
                <p>{{item.price}}</p>
                <button class="buy-btn">Купить</button>
            </div>
        `
    })

    Vue.component('basket', {
        template: `
            <div class="basket_space">
                <div class="basket_space-content">
                    <h3>Список товаров в корзине:</h3>
                    <div>Товары(временно)</div>
                </div>
            </div>
        `
    })


    Vue.component('search-input', {
        template: `
        <input @input="$emit('input', $event.target.value)" type="text" class="products-search">
        `
    })

    const app = new Vue({
        el: '#root',
        data: {
            items: [],
            itemsInBasket: [],
            searchValue: '',
            isVisibleCart: false
        },
        methods: {
            clickOnBasket() {
                this.isVisibleCart = !this.isVisibleCart
            }
        },
        computed: {
            getSum() {
                return this.items.reduce((sum, item) => sum + item.price, 0);
            },
            filteredItems() {
                return this.items.filter(({ product_name }) => {
                    return product_name.match(new RegExp(this.searchValue, 'gui'));
                })
            }
        },
        mounted() {
            service(PRODUCTS).then((data) => {
                this.items = data;
                return data;
            })
        },
    })
}