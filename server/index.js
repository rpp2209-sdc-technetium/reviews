const express = require('express')
const path = require('path');
const { searchmeta, searchpid, insert, makehelp, report } = require('./db')

const port = 5000;
const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))
app.get('/reviews', (req, res, next) => {
    let page = req.query.page ? req.query.page : 1
    let count = req.query.count ? req.query.count : 5
    let order
    if (req.query.sort === "newest") {
        order = 'date'
    } else if (req.query.sort === "helpful") {
        order = 'helpfulness'
    } else {
        order = 'review_id'
    }
    const total = page * count
    searchpid(req.query.product_id, total, order).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err)
    })
})
app.get('/reviews/meta', (req, res, next) => {
    searchmeta(req.query.product_id).then((result) => {
        res.send(result)
    }).catch((err) => {
        res.send(err)
    })
})
app.post('/reviews', (req, res, next) => {
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.body
    insert(product_id, rating, summary, body, recommend, name, email, photos, characteristics).then((result) => {
        res.sendStatus(201)

    }).catch((err) => {
        res.send(err)
    })
})
app.put('/reviews/:review_id/helpful', (req, res) => {
    makehelp(req.params.review_id).then(() => {
        res.sendStatus(204)
    }).catch((err) => {
        res.send(err)
    })
})
app.put('/reviews/:review_id/report', (req, res) => {
    report(req.params.review_id).then(() => {
        res.sendStatus(204)
    }).catch((err) => {
        res.send(err)
    })
})
app.listen(port, () => {
    console.log(`Server listening at localhost:${5000}!`);
});




