const express = require('express')
const xss = require('xss')
const InventoryService = require('./inventory-service')
const CheckoutService = require('./checkout-service')

const inventoryRouter = express.Router()
const jsonParser = express.json()

const sanitizeItem = item => ({
    id: xss(item.id),
    name: xss(item.name),
    quantity: xss(item.quantity),
    category: xss(item.category),
    image: xss(item.image)
})

const sanitizeCheckout = checkout => ({
    quantity: xss(checkout.sum)
})

inventoryRouter
    .route('/')
    .get((req, res, next) => {
        InventoryService.getInventory(
            req.app.get('db')
        )
        .then(inventory => {
        res.json(inventory.map(sanitizeItem))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name, quantity, category, image} = req.body
        const newItem = {name, quantity, category, image}

        for (const [key, value] of Object.entries(newItem)) {
            if (value == null) {
                return res.status(400).json({
                error: { message: `Missing ${key} in request`}
                })
            }
        }

        InventoryService.insertInventory(req.app.get('db'), newItem)
            .then(item => {
                res
                    .status(201)
                    .json(sanitizeUser(item))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        if (req.params.clearCheckOut) {
            console.log('if ran')
            CheckoutService.removeCheckOutbyItemId(req.app.get('db'), req.query.id)
            .catch(next)
        }

        InventoryService.removeInventory(req.app.get('db'), req.query.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

inventoryRouter
    .route('/checkout')
    .get((req, res, next) => {
        CheckoutService.getCheckOutByItem(
            req.app.get('db'),
            req.query.id
        )
        .then(checkout => {
        res.json(checkout.map(sanitizeCheckout))
        })
        .catch(next)
    })

module.exports = inventoryRouter