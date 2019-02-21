var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{title: 'KBA'});
});

router.post('/',function(req, res){
  var data = req.body.write;
  console.log("Data sent to REST API", data);
  var client = new UserClient();
  client.send_data([data]);
  res.send({message: "Data " +data+" successfully added"});
})

router.get('/state',async function(req,res){
  var client = new UserClient();
  var getData = client._send_to_rest_api(null);
  console.log("Data got from REST API", getData);
  getData.then(result => {res.send({ balance : result });});
})
module.exports = router;
