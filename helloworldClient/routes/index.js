var express = require('express');
var bodyParser = require('body-parser');
var { UserClient } = require('./UserClient')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'HelloWorld' });
});

router.post('/write', function (req, res) {
  const data = req.body.inputdata;
  console.log("payload -->", data);
  var client = new UserClient();
  client.send_data(data);
  res.send({ message: "Request sent" });
})

router.get('/read', async function (req, res) {
  var client = new UserClient();
  var readData = client._send_to_rest_api(null);
  readData.then(function (data) {
    res.send({ statedata: data });
  });
})

module.exports = router;
