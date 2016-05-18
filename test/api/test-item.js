"use strict";

let fs = require("fs")
,   path = require("path")
,   mockStr = require("mock-data").string(24, 24, "#a")
,   chai = require("chai")
,   chaiHttp = require("chai-http")
,   server = require("../../bin/www")
,   should = chai.should();

chai.use(chaiHttp);

const API_URL = "/api/items";

describe("Items", function() {
  
  let itemCount
  ,   itemId
  ,   itemName = mockStr.generate();
      
  it("should list ALL items on /api/items GET", function(done) {
    this.timeout(10000);
    
    chai.request(server)
      .get(API_URL)
      .end(function(err, res) {
        res.should.have.status(200);
        
        let items = res.body;
        itemCount = items.length;
        items.should.be.an("array");
        
        done();
      });
  });
  
  it("should add a new item on /api/items POST", function(done) {
    this.timeout(20000);
    
    let rawData = {
      name: itemName,
      tag: ["TABLE"],
      weight: 100,
      feature: {
        price: 3100, 
        stock: 1
      },
      dimension: {
        length: 11,
        width: 12,
        height: 13
      }
    };
    
    chai.request(server)
      .post(API_URL)
      .field("item", JSON.stringify(rawData))
      .attach("image", fs.readFileSync(path.resolve(__dirname, "test-image.jpg")), "TEST_IMAGE.jpg")
      .end(function(err, res) {
        res.should.have.status(200);
        
        let newItem = res.body;
        
        newItem.should.be.an("object");
        newItem._id.should.be.ok;
        
        itemId = newItem._id;
        
        console.log(newItem);
        done();
      });
  });
  
  it("should be able to get the item just added on /api/items/:id GET", function(done) {
    this.timeout(20000);
    
    chai.request(server)
      .get(API_URL)
      .query({id: itemId})
      .end(function(err, res) {
        res.should.have.status(200);
        
        let item = res.body;
        
        item.should.be.an("object");
        item._id.should.equal(itemId);
        
        item.name.should.equal(itemName);
        done();
      });
  });
  
  it("should update item info on /api/items PUT", function(done) {
    this.timeout(20000);
    
    let newItemName = mockStr.generate();
    let newValue = {
      name: newItemName
    };
    
    chai.request(server)
      .put(API_URL)
      .query({id: itemId})
      .send({item: JSON.stringify(newValue)})
      .end(function(err, res) {
        res.should.have.status(200);
        
        let newItem = res.body;
        
        newItem.should.be.an("object");
        newItem._id.should.equal(itemId);
        
        newItem.name.should.equal(newItemName);
        done();
      });
  });
  
  it("should delete item on /api/items DELETE", function(done) {
    chai.request(server)
      .del(API_URL)
      .query({id: itemId})
      .end(function(err, res) {
        res.should.have.status(200);
        
        console.log(res.body);
        done();
      });
  });
});

