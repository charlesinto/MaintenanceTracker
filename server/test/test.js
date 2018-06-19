import app from '../index'
import chai from 'chai';
import chaiHttp from 'chai-http'
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);

let loggedInToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZmlyc3RuYW1lIjoiY2hhcmxlcyIsImxhc3RuYW1lIjoib251b3JhaCIsInJvbGVfaWQiOjEsImVtYWlsIjoibGluYWVrZWhAZ21haWwuY29tIiwiaWF0IjoxNTI5MjYxNzk1LCJleHAiOjE1Mjk4NjY1OTV9.75NoXO4VF0aMD4DYM99F3FYpsOux4BCI5XKQSAkV31Q"
let loginUser = {
    "email":"linaekeh@gmail.com",
    "password":"3450"
}
let user = {
    "firstname":"    charles",
	"lastname": "   onuorah    ",
     "email": " linaekeh@gmail.com",
     "password":" 3450  ",
     "phonenumber":"   08163113450"
}
let request = {
	"item":"laptop",
	"itemcategory":"electronics",
	"requestcategory":"repairs",
	"complaints":"faulty keyboard"
	
}
describe('login/signup', function(){
    describe('It should sign up user',function(){
        this.timeout(20000)
        it('response should have a status of 406',(done)=>{
            chai.request(app).post('/api/v1/auth/signup').type('form').send(user).end(function(err,res){
                expect(res).to.have.status(406);
                done();
            })
        })
        it('response should be an object', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(user).end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response.text to be a string', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(user).end(function(err,res){
                expect(res.text).to.be.string
                done();
            })
        })
        it('response to have property message and token', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(user).end(function(err,res){
                expect(res.body).to.have.own.property('message');
                done();
            })
        })
        it('response.message to be signup successful', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(user).end(function(err,res){
                expect(res.body).to.deep.equal({message: `User already exists`})
                done();
            })
        })
    })
    describe('it should login a user', function(){
        this.timeout(20000)
        it('response should have a status of 200',(done)=>{
            chai.request(app).post('/api/v1/auth/login').type('form').send(loginUser).end(function(err,res){
                expect(res).to.have.status(200);
                done();
            })
        })
        it('response should be an object', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(loginUser).end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response.text to be a string', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(loginUser).end(function(err,res){
                expect(res.text).to.be.string
                done();
            })
        })
        it('response to have property message and token', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(loginUser).end(function(err,res){
                expect(res.body).to.have.property('message');
                done();
            })
        })
        it('response.message to be welcome', function(done){
            chai.request(app).post('/api/v1/auth/login').type('form').send(loginUser).end(function(err,res){
            
                expect(res.body.message).to.equal("welcome")
                done();
            })
        })
    })
    describe('it should get all requests of a user',function(){
        this.timeout(20000);
        it('response should have a status of 200',(done)=>{
            chai.request(app).get('/api/v1/users/requests').set('authorization', loggedInToken).end(function(err,res){
                
                expect(res).to.have.status(200);
                done();
            })
        })
        it('response should be an object', function(done){
            chai.request(app).get('/api/v1/users/requests').set('authorization', loggedInToken).end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response.text to be a string', function(done){
            chai.request(app).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function(err,res){
                expect(res.text).to.be.string
                done();
            })
        })
        it('response to have property message', function(done){
            chai.request(app).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function(err,res){
                expect(res.body).to.have.property('message');
                done();
            })
        })
        it('response to have property requests', function(done){
            chai.request(app).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function(err,res){
                expect(res.body).to.have.property('requests');
                done();
            })
        })
        it('response.message to be operation successful', function(done){
            chai.request(app).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function(err,res){
            
                expect(res.body.message).to.equal("operation successful")
                done();
            })
        })
        it('request should be an array', function(done){
            chai.request(app).get('/api/v1/users/requests').set("authorization", loggedInToken).end(function(err,res){
            
                expect(res.body.requests).to.be.an('array')
                done();
            })
        })
        
    })
    describe('it should get a request of a user',function(){
        this.timeout(20000);
        it('response should have a status of 200',(done)=>{
            chai.request(app).get('/api/v1/user/request/1').set('authorization', loggedInToken).end(function(err,res){
                
                expect(res).to.have.status(200);
                done();
            })
        })
        it('response should be an object', function(done){
            chai.request(app).get('/api/v1/user/request/1').set('authorization', loggedInToken).end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response.text to be a string', function(done){
            chai.request(app).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function(err,res){
                expect(res.text).to.be.string
                done();
            })
        })
        it('response to have property message', function(done){
            chai.request(app).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function(err,res){
                expect(res.body).to.have.property('message');
                done();
            })
        })
        it('response to have property requests', function(done){
            chai.request(app).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function(err,res){
                expect(res.body).to.have.property('requests');
                done();
            })
        })
        it('response.message to be operation successful', function(done){
            chai.request(app).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function(err,res){
            
                expect(res.body.message).to.equal("operation successful")
                done();
            })
        })
        it('request should be an array', function(done){
            chai.request(app).get('/api/v1/user/request/1').set("authorization", loggedInToken).end(function(err,res){
            
                expect(res.body.requests).to.be.an('array')
                done();
            })
        })
        
    })
    describe('it should create a new request',function(){
        this.timeout(20000);
        it('response should have a status of 201',(done)=>{
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
                
                expect(res).to.have.status(201);
                done();
            })
        })
        it('response should be an object', function(done){
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
                expect(res).to.be.an('object');
                done();
            })
        })
        it('response.text to be a string', function(done){
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
                expect(res.text).to.be.string
                done();
            })
        })
        it('response to have property message', function(done){
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
                expect(res.body).to.have.property('message');
                done();
            })
        })
        it('response to have property requests', function(done){
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
                expect(res.body).to.have.property('request');
                done();
            })
        })
        it('response.message to be a string', function(done){
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
            
                expect(res.body.message).to.be.string;
                done();
            })
        })
        it('response.message to be operation successful', function(done){
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
            
                expect(res.body.message).to.equal("operation successful")
                done();
            })
        })
        it('request should be an object', function(done){
            chai.request(app).post('/api/v1/user/request').set('authorization', loggedInToken).send(request).end(function(err,res){
            
                expect(res.body.request).to.be.an('object')
                done();
            })
        })
        
    })       
}) 

    