import { writeFile, readFile } from 'fs/promises'
import express from 'express';
import cors from 'cors';
import { get } from 'http';


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

function getReformBasket(){
        return Promise.all([
        readBasket(),
        readProducts()
    ]).then(([basketList, productsList]) => {
        const result = basketList.map((basketItem) => {
            const productsItem = productsList.find(({ id: _productsId }) => {
                return _productsId === basketItem.id
            });
            return {
                ...basketItem,
                ...productsItem
            }
        }) 
        return result
    }) 
}

app.post('/basket', (res, req) => {
    console.log(res.body);

    readBasket().then((basket) => {
        const basketItem = basket.find(({id: _id}) => _id === res.body.id);
        if (!basketItem) {
            basket.push({
                id: res.body.id,
                count: 1,
            })
        } else {
            basket = basket.map((basketItem) => {
                if (basketItem.id === res.body.id) {
                    return {
                        ...basketItem,
                        count: basketItem.count + 1
                    }
                } else {
                    return basketItem
                }
            })
        }
        return writeFile(BASKET, JSON.stringify(basket)).then(() => {
           return getReformBasket()
    }).then((result) => {
        req.send(result)
    })
    })
})

app.delete('/basket', (res, req) => {
    readBasket().then((basket) => {
        const basketItem = basket.find(({id: _id}) => _id === res.body.id);
        basket = basket.map((basketItem) => {
                if (basketItem.id === res.body.id) {
                    return {
                        ...basketItem,
                        count: basketItem.count - 1
                    } 
                    } else {
                    return basketItem
                    }
            })
        basket = basket.filter((basketItem) => {
            return basketItem.count > 0
        })

        return writeFile(BASKET, JSON.stringify(basket)).then(() => {
           return getReformBasket()
    }).then((result) => {
        req.send(result)
    })
    })
})

app.get('/basket', (res, req) => {
    getReformBasket().then((result) => {
        req.send(JSON.stringify(result))
    })
    // return Promise.all([
    //     readBasket(),
    //     readProducts()
    // ]).then(([basketList, productsList]) => {
    //     const result = basketList.map((basketItem) => {
    //         const productsItem = productsList.find(({ id: _productsId }) => {
    //             return _productsId === basketItem.id
    //         });
    //         return {
    //             ...basketItem,
    //             ...productsItem
    //         }
    //     }) 
    //     return result
    // }) 
});

app.listen('8000', () => {
    console.log('server is starting!')
})