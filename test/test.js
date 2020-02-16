const chai = require('chai')
const chaiHttp = require('chai-http')
var chaiMatchPattern = require('chai-match-pattern');
const expect = chai.expect
chai.use(chaiHttp)
chai.use(chaiMatchPattern)
var _ = chaiMatchPattern.getLodashModule();

var baseURL = "http://jsonplaceholder.typicode.com"

describe('API', () => {
    describe('Request details for a valid user', async () => {

        it('should return valid attributes for user 1', async () => {
            const res = await chai.request(baseURL)
                .get("/users/1")

            expect(res.body).to.matchPattern({
                id: 1,
                name: _.isString,
                username: _.isString,
                email: _.isEmail,
                address: {
                    street: _.isString,
                    suite: _.isString,
                    city: _.isString,
                    zipcode: /\d{5}\W\d{4}/,
                    geo: _.isObject
                },
                phone: /\d\W\d{3}\W\d{3}\W\d{4}\s\D\d{5}/,
                website: _.isString,
                company: {
                    name: _.isString,
                    catchPhrase: _.isString,
                    bs: _.isString
                }
            })
        })

        it('should return a 200 status', async () => {
            const res = await chai.request(baseURL)
                .get("/users/2")

            expect(res).to.have.status(200)
        })
    })

    describe('Request details for an invalid user', async () => {
        it('should return a 404 status', async () => {
            const res = await chai.request(baseURL)
                .get("/users/banana")

            expect(res).to.have.status(404)
        })
    })

    describe('Create new user', async () => {
        it('should return a 201 status', async () => {
            const res = await chai.request(baseURL)
                .post("/users")
                .send({
                    id: 99381,
                    name: 'Bruce The Legend',
                    username: 'undevelopedbruce',
                    email: 'Sincerzze@april.biz',
                    address: {
                        street: 'A dark, dark street',
                        suite: 'A dark, dark suite',
                        city: 'A dark, dark city',
                        zipcode: 'D4RKD4RKZIP',
                        geo: { lat: '-37.3159', lng: '81.1496' }
                    },
                    phone: '1-770-736-8031 x56442',
                    website: 'undevelopedbruce.com',
                    company: {
                        name: 'Funnybones Inc',
                        catchPhrase: 'Not just for halloween',
                        bs: 'there is no bs, only bones n skullz'
                    }
                })

            expect(res).to.have.status(201)
        })
    })

    //This test fails because there is a bug - it should not be possible
    //to create a new user resource without an id, and with missing and
    //misspelled attribute keys
    describe('Create invalid user', async () => {
        it('should return a 400 status', async () => {
            const res = await chai.request(baseURL)
                .post("/users")
                .send({
                    n4me: 'Bruce The Legend',
                    username: 'undevelopedbruce',
                    beans: 'Sincerzze@april.biz',
                    addrebs: {
                        street: 'A dark, dark street',
                        suite: 'A dark, dark suite',
                        city: 'A dark, dark city',
                        zipcode: 'D4RKD4RKZIP',
                        geo: { lat: '-37.3159', lng: '81.1496' }
                    },
                    weebsite: 'undevelopedbruce.com',
                    companies: {
                        name: 'Funnybones Inc',
                        catchPhrase: 'Not just for halloween',
                        bs: 'there is no bs, only bones n skullz'
                    }
                })

            expect(res).to.have.status(400)
        })
    })

    describe('Delete a user', async () => {
        it('should return a 200 status', async () => {
            const res = await chai.request(baseURL)
                .del("/users/1")

            expect(res).to.have.status(200)
        })
    })

    //This test fails because the returned headers don't match
    //the acceptance I was given.
    describe('Request a list of users', async () => {
        it('should return expected headers', async () => {
            const res = await chai.request(baseURL)
                .get("/users")

            expect(res).to.have.status(200)
            expect(res).to.have.header('content-type', 'application/json');
            expect(res).to.have.header('cache-control', 'public')
            expect(res.headers.connection).to.deep.equal('keep-alive')
        })
    })

    describe('Request a list of posts filtered by user', async () => {
        it('should return a list of posts', async () => {
            const res = await chai.request(baseURL)
                .get("/posts?userId=1")
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body[0]).to.matchPattern({
                userId: 1,
                id: 1,
                title: _.isString,
                body: _.isString
            })
        })
    })

})

