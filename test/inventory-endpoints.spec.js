const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray, makeInventoryArray, makeCheckoutArray } = require('./fixtures')

describe('Inventory endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users, inventory, checkout RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE users, inventory, checkout RESTART IDENTITY CASCADE'))

    describe('GET /api/inventory', () => {
        context('Given no inventory', () => {
            it('responds 200 and with empty list', () => {
                return supertest(app)
                    .get('/api/inventory')
                    .expect(200, [])
            })
        })

        context('Given there are inventory in the database', () => {
            const testInventory = makeInventoryArray();
            beforeEach('insert inventory', () => {
                return db
                    .into('inventory')
                    .insert(testInventory)
                })
           

            it('GET /api/inventory responds 200 and with all inventory', () => {
                return supertest(app)
                    .get('/api/inventory')
                    .expect(200)
            })
        })
    })

    describe('POST /api/inventory', () => {
        it('POST /api/inventory returns 201 and with new item', () => {
            const newItem = {
                name: 'test item',
                quantity: 1,
                category: 'test',
                image: 'test'
            }
            return supertest(app)
                .post('/api/inventory')
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newItem.name)
                    expect(Number(res.body.quantity)).to.eql(newItem.quantity)
                    expect(res.body.category).to.eql(newItem.category)
                    expect(res.body.image).to.eql(newItem.image)
                    expect(res.body).to.have.property('id')
                    expect(res.body).to.have.property('quantityAvailable')
                })
        })

        it('responds 400 with error message when field missing', () => {
            const newItem = {
                quantity: 1,
                category: 'test',
                image: 'test'
            }

            return supertest(app)
                .post('/api/inventory')
                .send(newItem)
                .expect(400, {
                    error: {message: `Missing name in request`}
                })
        })
    })
    
    describe('DELETE /api/inventory', () => {
        context('Given data in database', () => {
            const testUsers = makeUsersArray()
            const testInventory = makeInventoryArray()
            const testCheckout = makeCheckoutArray()
            beforeEach('insert data', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                        .into('inventory')
                        .insert(testInventory)
                    })
                    .then(() => {
                        return db
                        .into('checkout')
                        .insert(testCheckout)
                    })
                })

            it('responds 204 when inventory has no checkouts', () => {
                return supertest(app)
                    .delete('/api/inventory?id=4')
                    .expect(204)
            })

            it('responds 204 when inventory has checkouts', () => {
                return supertest(app)
                    .delete('/api/inventory?id=1')
                    .expect(204)
            })
        })
    })
})