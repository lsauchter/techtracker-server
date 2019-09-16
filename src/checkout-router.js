const express = require('express')
const xss = require('xss')
const CheckoutService = require('./checkout-service')

const checkoutRouter = express.Router()
const jsonParser = express.json()

const sanitizeItem = checkout => ({
    user_id: xss(checkout.userId),
    inventory_id: xss(checkout.itemId),
    quantity: xss(checkout.quantity),
})

checkoutRouter
    .route('/')
    .get((req, res, next) => {
        CheckOutService.getCheckOut(
            req.app.get('db'),
            req.body.id
        )
        .then(checkout => {
        res.json(checkout.map(sanitizeItem))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name, quantity, category, image} = req.body
        const newItem = {name, quantity, quantityAvailable: quantity, category, image}

        for (const [key, value] of Object.entries(newItem)) {
            if (value == null) {
                return res.status(400).json({
                error: { message: `Missing ${key} in request`}
                })
            }
        }

        CheckOutService.insertCheckOut(req.app.get('db'), newItem)
            .then(item => {
                res
                    .status(201)
                    .json(sanitizeUser(item))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        CheckoutService.removeCheckOutbyItemId(req.app.get('db'), req.body.id)
            .catch(next)
            
        CheckOutService.removeCheckOut(req.app.get('db'), req.body.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

checkoutRouter
    .route('/user:id')
    .get((req, res, next) => {
        CheckOutService.getCheckOutByUser(
            req.app.get('db'),
            req.body.id
        )
        .then(checkout => {
        res.json(checkout.map(sanitizeItem))
        })
        .catch(next)
    })

checkoutRouter
    .route('/item:id')
    .get((req, res, next) => {
        CheckOutService.getCheckOutByUser(
            req.app.get('db'),
            req.body.id
        )
        .then(checkout => {
        res.json(checkout.map(sanitizeItem))
        })
        .catch(next)
    })

module.exports = checkoutRouter