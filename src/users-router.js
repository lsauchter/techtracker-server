const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const CheckoutService = require('./checkout-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const sanitizeUser = user => ({
    id: xss(user.id),
    name: xss(user.name)
})

const sanitizeCheckoutUser = checkout => ({
    inventory_id: xss(checkout.inventory_id),
    quantity: xss(checkout.quantity),
})

const sanitizeCheckout = checkout => ({
    user_id: xss(checkout.user_id),
    inventory_id: xss(checkout.inventory_id),
    quantity: xss(checkout.quantity),
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getUsers(
            req.app.get('db')
        )
        .then(users => {
        res.json(users.map(sanitizeUser))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name} = req.body
        const newUser = {name}

        if (!name) {
            return res.status(400).json({
                error: { message: 'Missing name in request'}
            })
        }

        UsersService.insertUser(req.app.get('db'), newUser)
            .then(user => {
                res
                    .status(201)
                    .json(sanitizeUser(user))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        if (req.params.clearCheckOut) {
            console.log('if ran')
            CheckoutService.removeCheckOutByUserId(req.app.get('db'), req.query.id).catch(next)
        }
        UsersService.removeUser(req.app.get('db'), req.query.id)
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

usersRouter
    .route('/checkout')
    .get((req, res, next) => {
        CheckoutService.getCheckOutByUser(
            req.app.get('db'),
            req.query.id
        )
        .then(checkout => {
        res.json(checkout.map(sanitizeCheckoutUser))
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        console.log(req.body)
        const {user_id, data} = req.body
        const dataKeys = Object.keys(data)

        if (user_id == null) {
            return res.status(400).json({
                error: { message: 'Missing user id in request'}
            })
        }

        if (dataKeys.length === 0) {
            return res.status(400).json({
                error: { message: 'Missing check out data in request'}
            })
        }

        dataKeys.forEach(item => {
            const checkout = {
                user_id,
                inventory_id: item,
                quantity: data[item]
            }
            console.log(checkout)
            CheckoutService.insertCheckOut(req.app.get('db'), checkout)
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
    })

usersRouter
    .route('/checkin')
    .patch(jsonParser, (req, res, next) => {
        const {user_id, data} = req.body
        const dataKeys = Object.keys(data)

        if (!user_id) {
            return res.status(400).json({
                error: { message: 'Missing user id in request'}
            })
        }

        if (!data) {
            return res.status(400).json({
                error: { message: 'Missing data in request'}
            })
        }

        if (dataKeys.length === 0) {
            return res.status(400).json({
                error: { message: 'Missing check out data in request'}
            })
        }

        dataKeys.forEach(item => {
            const inventory_id = item
            const quantity = data[item]

            CheckoutService.updateCheckOut(req.app.get('db'), user_id, inventory_id, quantity)
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
    })
    .delete(jsonParser, (req, res, next) => {
        const {user_id, data} = req.body
        const dataKeys = Object.keys(data)

        if (!user_id) {
            return res.status(400).json({
                error: { message: 'Missing user id in request'}
            })
        }

        if (!data) {
            return res.status(400).json({
                error: { message: 'Missing data in request'}
            })
        }

        if (dataKeys.length === 0) {
            return res.status(400).json({
                error: { message: 'Missing check out data in request'}
            })
        }

        dataKeys.forEach(item => {
            const checkout = {user_id, inventory_id: item}
            CheckoutService.removeCheckOut(req.app.get('db'), checkout)
                .then(checkoutItem => {
                    res
                        .status(201)
                        .json(sanitizeCheckout(checkoutItem))
                })
                .catch(next)
        })
    })

module.exports = usersRouter