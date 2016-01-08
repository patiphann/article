process.env.NODE_ENV = 'test';

var request = require('supertest');
var chai = require('chai');
var chaiHttp = require('chai-http');

var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;
chai.use(chaiHttp);

var app = require('../server');
var User = require('../modules/users/server/models/users.server.model');
var Article = require('../modules/articles/server/models/article.server.model');

var Cookies;
var agent = request(app);

describe('Main API',function(){
  it('should main templates / GET',function(done){
    agent
    .get('/')
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
});

describe('User API',function(){

  // drop collection users
  User.collection.drop();

  it('should signup success /signup POST',function(done){
    agent
    .post('/signup')
    .send({ email: 'test@test.com', password: 'test', name: 'test', surname: 'test' })
    .end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('_id');
      res.body.should.have.property('email');
      res.body.should.have.property('name');
      res.body.should.have.property('surname');
      res.body.email.should.equal('test@test.com');
      res.body.name.should.equal('test');
      res.body.surname.should.equal('test');
      done();
    });
  });

  it('should signup fail /signup POST',function(done){
    agent
    .post('/signup')
    .send({ email: 'test@test.com', password: 'test', name: 'test', surname: 'test' })
    .end(function(err, res){
      res.should.have.status(888);
      done();
    });
  });
});

describe('Login API',function(){
  it('should login fail /login POST',function(done){
    agent
    .post('/login')
    .send({ email: 'test2@test.com', password: 'test' })
    .end(function(err, res){
      res.should.have.status(888);
      done();
    });
  });

  it('should login success /login POST',function(done){
    agent
    .post('/login')
    .send({ email: 'test@test.com', password: 'test' })
    .end(function(err, res){

      // Save the cookie to use it later to retrieve the session
      Cookies = res.headers['set-cookie']
      .map(function(r){
        return r.replace("; path=/; httponly","") 
      }).join("; ");

      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('_id');
      res.body.should.have.property('email');
      res.body.should.have.property('image');
      res.body.should.have.property('name');
      res.body.should.have.property('surname');
      res.body.should.have.property('create_date');
      res.body.email.should.equal('test@test.com');
      res.body.image.should.equal('/users/uploads/default.gif');
      res.body.name.should.equal('test');
      res.body.surname.should.equal('test');
      done();
    });
  });

  it('should check login success /check-auth GET',function(done){
    var req = agent.get('/check-auth');

    req.cookies = Cookies;

    req.end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
});

describe('Edit Profile API',function(){
  // no image
  it('should edit profile success /edit-profile POST',function(done){
    User.findOne({ email: 'test@test.com' }, function(err, data){
      if(err){
        console.log('select email error');
      }else{
        agent
        .post('/edit-profile')
        .send({ _id: data._id, name: 'tests', surname: 'tests' })
        .end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('email');
          res.body.should.have.property('image');
          res.body.should.have.property('name');
          res.body.should.have.property('surname');
          res.body.email.should.equal('test@test.com');
          res.body.image.should.equal('/users/uploads/default.gif');
          res.body.name.should.equal('tests');
          res.body.surname.should.equal('tests');
          done();
        });
      }
    });
  });
});

describe('Article API',function(){

  Article.collection.drop();
  var dataArticle = {};

  it('should save article success /save-article POST',function(done){
    var req = agent.post('/save-article');

    req.cookies = Cookies;
    req.send({ title: 'test', content: 'test' });

    req.end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.should.have.property('content');
      res.body.should.have.property('create_by');
      res.body.should.have.property('create_name');
      res.body.should.have.property('update_by');
      res.body.should.have.property('update_name');
      res.body.title.should.equal('test');
      res.body.content.should.equal('test');
      res.body.create_name.should.equal('tests tests');
      res.body.update_name.should.equal('tests tests');
      done();
    });
  });

  it('should list article success /list-article POST',function(done){
    var req = agent.post('/list-article');
    req.end(function(err, res){

      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');

      if(res.body.length > 0){
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('title');
        res.body[0].should.have.property('content');
        res.body[0].should.have.property('create_by');
        res.body[0].should.have.property('create_date');
        res.body[0].should.have.property('create_name');
        res.body[0].should.have.property('update_by');
        res.body[0].should.have.property('update_date');
        res.body[0].should.have.property('update_name');
        res.body[0].title.should.equal('test');
        res.body[0].content.should.equal('test');
        res.body[0].create_name.should.equal('tests tests');
        res.body[0].update_name.should.equal('tests tests');
      }
      
      done();
    });
  });

  it('should select article success /data-article POST',function(done){
    Article.findOne({ title: 'test' }, function(err, data){
      if(err){
        console.log('select article error');
      }else{

        dataArticle = data;

        var req = agent.post('/data-article');
        req.send({ _id: dataArticle._id });
        req.end(function(err, res){
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('_id');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
          res.body.should.have.property('create_by');
          res.body.should.have.property('create_date');
          res.body.should.have.property('create_name');
          res.body.should.have.property('update_by');
          res.body.should.have.property('update_date');
          res.body.should.have.property('update_name');
          res.body.title.should.equal('test');
          res.body.content.should.equal('test');
          res.body.create_name.should.equal('tests tests');
          res.body.update_name.should.equal('tests tests');
          
          done();
        });
      }
    });
  });

  it('should update article success /edit-article POST',function(done){
    var req = agent.post('/edit-article');

    req.cookies = Cookies;
    req.send({ _id: dataArticle._id , title: 'tests', content: 'tests' });

    req.end(function(err, res){
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('_id');
      res.body.should.have.property('title');
      res.body.should.have.property('content');
      res.body.should.have.property('create_by');
      res.body.should.have.property('create_name');
      res.body.should.have.property('update_by');
      res.body.should.have.property('update_name');
      res.body.title.should.equal('tests');
      res.body.content.should.equal('tests');
      res.body.create_name.should.equal('tests tests');
      res.body.update_name.should.equal('tests tests');
      done();
    });
  });

  it('should del article success /del-article POST',function(done){
    var req = agent.post('/del-article');

    req.cookies = Cookies;
    req.send({ _id: dataArticle._id });

    req.end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
});

describe('Logout API',function(){
  it('should logut success /logout GET',function(done){
    var req = agent.get('/logout');
    req.cookies = Cookies;

    req.end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });
});