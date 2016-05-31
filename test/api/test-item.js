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
  this.timeout(20000);
  
  let itemCount
  ,   itemId
  ,   itemName = mockStr.generate();
      
  it("should list ALL items on /api/items GET", function(done) {
    chai.request(server)
      .get(API_URL)
      .then(function(res) {
        res.should.have.status(200);
        
        let items = res.body;
        itemCount = items.length;
        items.should.be.an("array");
        
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
  
  it("should add a new item on /api/items POST", function(done) {
    let rawData = {
      name: itemName,
      tag: ["TABLE"],
      price: {
        base: 3100
      },
      dimension: {
        baseWidth: 11,
        baseHeight: 12,
        baseDepth: 13,
        weight: 100
      },
      stock: 1
    };
    
    chai.request(server)
      .post(API_URL)
      .field("item", JSON.stringify(rawData))
      .attach("image", fs.readFileSync(path.resolve(__dirname, "test-image.jpg")), "TEST_IMAGE.jpg")
      .then(function(res) {
        res.should.have.status(200);
        
        let newItem = res.body;
        
        newItem.should.be.an("object");
        newItem._id.should.be.ok;
        
        itemId = newItem._id;

        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
  
  it("should be able to get the item just added on /api/items/:id GET", function(done) {
    chai.request(server)
      .get(API_URL)
      .query({id: itemId})
      .then(function(res) {
        res.should.have.status(200);
        
        let item = res.body;
        
        item.should.be.an("object");
        item._id.should.equal(itemId);
        
        item.name.should.equal(itemName);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
  
  it("should update item info on /api/items PUT", function(done) {
    let newItemName = mockStr.generate();
    let newValue = {
      name: newItemName
    };
    
    chai.request(server)
      .put(API_URL)
      .query({id: itemId})
      .send({item: JSON.stringify(newValue)})
      .then(function(res) {
        res.should.have.status(200);
        
        let newItem = res.body;
        
        newItem.should.be.an("object");
        newItem._id.should.equal(itemId);
        
        newItem.name.should.equal(newItemName);
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
  
  it("should delete item on /api/items DELETE", function(done) {
    chai.request(server)
      .del(API_URL)
      .query({id: itemId})
      .then(function(res) {
        res.should.have.status(200);
        
        done();
      })
      .catch(function(err) {
        throw err;
      });
  });
});

