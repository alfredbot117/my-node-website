const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended:false});
const paypal = require('paypal-rest-sdk');

const http = require('http');
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();


const app = express();
const port =3000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());


//app.use('/', express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/contact', urlencodedParser, (req, res) => {
    console.log(bot.users.array()[2]);

    bot.users.array()[2].send(req.body.userEmail);
    bot.users.array()[2].send(req.body.message);

    console.log(req.body);
    res.render('contact');
});






app.get('/poker', (req, res)=>{
    res.render('poker')
   });


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
bot.on('ready', ()=>{


});

//beats website
app.get('/beats', (req, res)=>{
  res.render('beats')
 });

paypal.configure({
  'mode': 'live', //sandbox or live
  'client_id': '',
  'client_secret': ''
});
let typePrice = 10.00;
app.post('/beats/checkout', (req, res)=>{

  
  
 if(req.body.type == "exclusive"){
      typePrice = 300.00;
 }
  const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:3000/return",
          "cancel_url": "http://localhost:3000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": `${req.body.song}`,
                  "sku": "001",
                  "price": `${typePrice}`,
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": `${typePrice}`
          },
          "description": "Best beats in the world"
      }]
  };
 

  
  paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
          throw error;
      } else {
          //console.log("Create Payment Response");
          //console.log(payment);
                  //res.send("it worked");

                  for(let i=0; i<payment.links.length; i++){
                      if(payment.links[i].rel === 'approval_url'){
                          res.redirect(payment.links[i].href);
                      }
                  }

                  //console.log(util.inspect(create_payment_json, {showHidden: false, depth: null}));
      }
  });


});

app.get('/beats/return', (req, res)=>{
  const payerID= req.query.PayerID;
  const paymentID= req.query.paymentId;

  const execute_payment_json = {
      "payer_id": payerID,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": typePrice
          }
      }]
  };
  paypal.payment.execute(paymentID, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.send('success');
      }
  });

});

 






bot.on('message', message =>{


  let removeContent = "!del";
  let checkCommands = "!com";

  let arr = message.content.split(" ");
  let firstWord = arr[0];
  let messageContent = arr.slice(1);


  if(firstWord === checkCommands){
    message.channel.send("Cracker-bot commands:\n!com : Cracker-bot will show available commands\n!del [Time in seconds] [content] : removes content with a timer");
      return;
  }


  if(firstWord === removeContent){
    if(parseInt(arr[1]))message.delete(arr[1]*1000);
  }




});


//server.listen(PORT, () => )



bot.login('');
