'use strict';

const API = 'http://localhost:8000/';
const PRODUCT = `${API}products`;
const PRODUCTS = `${API}products.json`;
const BASKET = `${API}basket`;

function service(url) {
    return fetch(url).then((res) => res.json())
}

function serviceWithBody(url = "", method = "POST", body = {}){
    return fetch(
        url,
        {
            method,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(body)
        }
    ).then((res) => res.json())
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
                <button class="buy-btn" @click="addProduct">добавить</button>
            </div>
        `,
        methods: {
            addProduct(){
                serviceWithBody(BASKET, "POST", {
                    id: this.item.id
                })
            }
        }
    })

    Vue.component('basket', {
        data() {
            return {
                basketProductsItems: []
            }
        },
        template: `
            <div class="basket_space">
                <div class="basket_space-content">
                    <h3>Список товаров в корзине:</h3>
                    <basket-item v-for="item in basketProductsItems" :item="item" @add="addProduct" @delete="deleteProduct"></basket-item>
                </div>
            </div>
        `,
        mounted() {
            service(BASKET).then((basketProducts) => {
                this.basketProductsItems = basketProducts;
            })
        },
        methods: {
            addProduct(id){
                serviceWithBody(BASKET, "POST", {
                    id
                }).then((data) => {
                    this.basketProductsItems = data;
                })
            },
            deleteProduct(id){
                serviceWithBody(BASKET, "DELETE", {
                    id
                }).then((data) => {
                    this.basketProductsItems = data;
                })
            }
        }
    })

    Vue.component('basket-item', {
        props: [
            'item'
        ],
        template: `
            <div>
              <div>
                <span>{{item.product_name}}</span>
                <span>({{item.price}}р.)</span>
              </div>
               <div>
                 <span>{{item.count}}шт.</span>
                 <button @click="$emit('add', item.id)">+</button>
                 <button @click="$emit('delete', item.id)">-</button>
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