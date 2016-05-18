"use strict";

let chai = require("chai"),
    chaiHttp = require("chai-http"),
    server = require("../../bin/www"),
    should = chai.should();

chai.use(chaiHttp);

const API_URL = "/api/items";

describe("Items", function() {
  
  let itemCount,
      newItemId;
      
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
    let rawData = {
      name: "Table",
      tag: ["table"],
      images: ["test.png"],
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
      .end(function(err, res) {
        res.should.have.status(200);
        
        let newItem = res.body;
        
        newItem.should.be.an("object");
        newItem._id.should.be.ok;
        
        newItemId = newItem._id;
        
        console.log(newItem);
        done();
      });
  });
});

