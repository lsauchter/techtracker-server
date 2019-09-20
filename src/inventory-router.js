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
    quantityAvailable: xss(item.quantityAvailable),
    category: xss(item.category),
    image: xss(item.image)
})

inventoryRouter
    .route('/')
    .get((req, res, next) => {
        InventoryService.getInventory(
            req.app.get('db')
        )
        .then(async inventory => {
            /* calculating quantityAvailable and adding key */
            const updatedInventory = []
            for (let i = 0; i < inventory.length; i++) {
                const item = inventory[i]
                await CheckoutService.getCheckOutByItem(req.app.get('db'), item.id)
                    .then(num => {
                        const sum = num[0].sum
                        if (sum !== null) {
                            const numAvailable = item.quantity - sum
                            item.quantityAvailable = numAvailable
                            updatedInventory.push(item)
                        }
                        else {
                            item.quantityAvailable = item.quantity
                            updatedInventory.push(item)
                        }
                    })
            }
            res.json(updatedInventory.map(sanitizeItem))
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
                item.quantityAvailable = item.quantity

                res
                    .status(201)
                    .json(sanitizeItem(item))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        CheckoutService.getCheckOutByItem(req.app.get('db'), req.query.id)
            .then(num => {
                if (num[0].sum > 0) {
                    CheckoutService.removeCheckOutbyItemId(req.app.get('db'), req.query.id)
                    .catch(next)
                }
                return Promise.resolve('ok')
            })
            .catch(next)
        
        InventoryService.removeInventory(req.app.get('db'), req.query.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = inventoryRouter