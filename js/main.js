'use strict';

const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
const PRODUCTS = `${API}/catalogData.json`;
const BASKET = `${API}/getBasket.json`;

function service(url) {
    return fetch(url).then((res) => res.json())
}

window.onload = () => {
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