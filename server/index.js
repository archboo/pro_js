import { writeFile, readFile } from 'fs/promises'
import express from 'express';
import cors from 'cors';

const BASKET = './public/basket_products.json'
const PRODUCTS = './public/products.json'

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const readBasket = () => readFile(BASKET, 'utf-8')
    .then((basketFile) => {
        return JSON.parse(basketFile)
    })

const readProducts = () => readFile(PRODUCTS, 'utf-8')
    .then((productFile) => {
        return JSON.parse(productFile)
    })

app.get('/basket', (res, req) => {
    readBasket().then((basketFile) => {
        console.log(basketFile)
    })
    readProducts().then((basketFile) => {
        console.log(basketFile)
    })

    Promise.all([
        readBasket(),
        readProducts()
    ]).then(([basketList, productsList]) => {
        return basketList.map((basketItem) => {
            const productsItem = productsList.find(({ id_product: _productsId }) => {
                return _productsId === basketItem.id_product
            });
            return {
                ...basketItem,
                ...productsItem
            }
        })
    }).then((result) => {
        req.send(JSON.stringify(result))
    })
});

app.listen('8000', () => {
    console.log('server is starting!')
})