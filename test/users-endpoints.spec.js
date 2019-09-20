const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray, makeInventoryArray, makeCheckoutArray } = require('./fixtures')

describe('Users endpoints', () => {
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

    describe('GET /api/users', () => {
        context('Given no users', () => {
            it('responds 200 and with empty list', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, [])
            })
        })

        context('Given there are users in the database', () => {
            const testUsers = makeUsersArray();
            beforeEach('insert users', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                })
           

            it('GET /api/users responds 200 and with all users', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200)
            })
        })
    })

    describe('POST /api/users', () => {
            it('POST /api/users returns 201 and with new user', () => {
                const newUser = {
                    name: 'test user'
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body.name).to.eql(newUser.name)
                        expect(res.body).to.have.property('id')
                    })
            })

            it('responds 400 with error message when field missing', () => {
                const newUser = {}

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(400, {
                        error: {message: `Missing name in request`}
                    })
            })
    })
    
    describe('DELETE /api/users', () => {
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

            it('responds 204', () => {
                return supertest(app)
                    .delete('/api/users?id=2')
                    .expect(204)
            })
        })
    })
})

describe('Users checkout endpoints', () => {
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

    describe('GET /api/users/checkout', () => {
        context('Given no checkouts', () => {
            it('responds 200 and with empty list', () => {
                return supertest(app)
                    .get('/api/users/checkout')
                    .expect(200, [])
            })
        })

        context('Given there are users and checkout in the database', () => {
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
           
            it('GET /api/users/checkout responds 200 and with all checkouts', () => {
                return supertest(app)
                    .get('/api/users/checkout')
                    .expect(200)
            })
        })
    })

    describe('POST /api/users/checkout', () => {
        context('Given data in database', () => {
            const testUsers = makeUsersArray()
            const testInventory = makeInventoryArray()
            beforeEach('insert data', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                        .into('inventory')
                        .insert(testInventory)
                    })
                })
            
            it('responds 201', () => {
                const testCheckout = {
                    user_id: 2,
                    data: {
                        3: 1
                    }
                }
                return supertest(app)
                    .post('/api/users/checkout')
                    .send(testCheckout)
                    .expect(201)
            })
        })
    })
})

describe('Users checkin endpoints', () => {
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

    describe('PATCH /api/users/checkin', () => {
        context('Given there are users and checkout in the database', () => {
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
           
            it('PATCH /api/users/checkin responds 204', () => {
                const updatedCheckout = {
                    user_id: 1,
                    inventory_id: 1,
                    quantity: 3
                }
                return supertest(app)
                    .patch('/api/users/checkin')
                    .send(updatedCheckout)
                    .expect(204)
            })
        })
    })

    describe('DELETE /api/users/checkin', () => {
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
            
            it('responds 204', () => {
                const testCheckin = {
                    user_id: 1,
                    inventory_id: 1
                    }
                return supertest(app)
                    .delete('/api/users/checkin')
                    .send(testCheckin)
                    .expect(204)
            })
        })
    })
})