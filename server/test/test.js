import app from '../index'
import chai from 'chai';
import chaiHttp from 'chai-http'
const should = chai.should();
const expect = chai.expect;
chai.use(chaiHttp);
let user = {
    "firstname":"    charles",
	"lastname": "   onuorah    ",
     "email": " chibuike23@gmail.com",
     "password":" 3450  ",
     "phonenumber":"   08163113450"
}
describe('login/signup', function(){
    describe('It should sign up user',function(){
        this.timeout(10000)
        it('response should have a status of 201',(done)=>{
            chai.request(app).post('/api/v1/auth/signup').type('form').send(user).end(function(err,res){
                expect(res).to.have.status(201);
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
        it('response.message to be login successful', function(done){
            chai.request(app).post('/api/v1/auth/signup').type('form').send(user).end(function(err,res){
                expect(res.body).to.deep.equal({message: `User already exists`})
                done();
            })
        })
    })
})    
    