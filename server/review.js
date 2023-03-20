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
    
})




