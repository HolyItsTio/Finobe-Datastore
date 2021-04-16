const express = require('express');
const app = express();
const fs = require("fs");
const Sequelize = require('sequelize');

var database = new Sequelize('sqlite::memory:', 'Finobe1', 'Join7Breakness6Today5And3Get@Really!Happy!', {
  host: "127.0.0.1",
  dialect: "sqlite",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: '.Finobe/places_database.sqlite'
});
var User

database.authenticate()
.then(function(){
  console.log("Connection established!");
  User = database.define("Finobe3", {
    PlaceId: {
      type: Sequelize.STRING
    },
    Key: {
      type: Sequelize.STRING
    },
    Data: {
      type: Sequelize.JSON
    }
  }); 
  User.sync();
}).catch(function(err){
  console.log("Issue while retrieving data: \n"+err)
});

app.get("/finobedb", async (request, response) => {
  const place = request.headers["place"]
  const key = request.headers["key"]
  const data = request.headers["data"]
  const method = request.headers["method"]
  console.log(request.headers)
  var found = false
  
  if (method == "get"){
    await User.findOne({
      where: {
        PlaceId: place,
        Key: key,
      }
    }).then(function(Data){
      if (!!Data.Data){
        found = true
        response.send(Data.Data)
        console.log(Data)
      }
    }).catch(function(err){
      console.log(err)
    })
    
  }    else 
  
  if (method == "update"){
    await User.update({
      Data: data
    }, {where: {
        PlaceId: place,
        Key: key,
    }})
    
    response.send("Success")
  } else if (method == "set"){
    console.log('set')
    console.log(data)
    await User.findOne({
      where: {
        PlaceId: place,
        Key: key,
      }
    }).then(function(Data){
      if (!!Data.Data){
        found = true
        console.log('found')
      }
    }).catch(function(err){
      console.log(err)
    })
    
      console.log('setting')
    if (found == false){
      await User.create({
        PlaceId: place,
        Key: key,
        Data: data
      })
      found = true
    } else {
      await User.update({
        Data: data
      }, {where: {
        PlaceId: place,
        Key: key,
      }})
    }
    
    response.send("Success")
  };
    if (found == false){
      response.send("nil")
    }
});



const listener = app.listen(process.env.PORT, () => {
  console.log("Listening on port " + listener.address().port);
});
