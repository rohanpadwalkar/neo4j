var neo4j_js = require('neo4j-js'),
	application_root = __dirname,
    express = require("express"),
	path = require("path"),
	HTTPStatus = require('http-status'),
	bodyParser = require('body-parser'),
	app = express(),
	moment = require('moment'),
	config = require('./config'),
	neo4j_js_url = process.env.NEO4J_URL +'/db/data/';
	
	
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Custom Queries
var getAllNodes = ['START n=node(*) RETURN n '];
var updateNode = ["START n = node({id}) SET n = { n } RETURN n"]

/* -----------NEO4J-JS Rest CRUD APIs--------- */

/**
Description: Create Any Node and Return it
*/
app.post('/api/neo4j-js/',function(req,res){

	var bodyMap = req.body;
	console.log("Request to Create Node, Params: = " + bodyMap);
	neo4j_js.connect(neo4j_js_url, function (err, graph) {
		graph.createNode(bodyMap, function(err,node){
			
			if (err) {
				console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
				res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
			}
			else {
				console.log("Response Code: " + HTTPStatus.OK + node);
				res.status(HTTPStatus.OK).send(node);
				
			}
		});
	});
});

/**
Description: Get a single Node and Return it
*/
app.get('/api/neo4j-js/:id',function(req,res){

	var id = req.params.id;
	console.log("Request to get Node, Params: id = " + id);
	neo4j_js.connect(neo4j_js_url, function (err, graph) {
	
	var date1 = moment().millisecond();
	console.log("Date1 : " + date1);
	
		graph.getNode(id, function(err,node){
			
			if (err) {
				console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
				res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
			}
			else {
				console.log("Response Code: " + HTTPStatus.OK + ", Data: " + node);
				
				var date2 = moment().millisecond();
				console.log("Date2 : " + date2);
				console.log("Request time:- " + (date2 - date1));
				
				res.status(HTTPStatus.OK).send( node);
				
			}
		});
		
	});
});

/**
Description: Get All Node and Returns them
*/
app.get('/api/neo4j-js/',function(req,res){

	console.log("Request to get All Node");
	neo4j_js.connect(neo4j_js_url, function (err, graph) {
		
	var date1 = moment().millisecond();
	console.log("Date1 : " + date1);
	
		graph.query("START n=node(*) RETURN n ",function(err,nodes){
			
			if (err) {
				console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
				res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
			}
			else {
				console.log("Response Code: " + HTTPStatus.OK + ", Total Nodes: " + nodes.length + ", Data : " + nodes);
				
				var date2 = moment().millisecond();
				console.log("Date2 : " + date2);
				console.log("Request time:- " + (date2 - date1));
				
				res.status(HTTPStatus.OK).send(nodes);
				
			}
		});
	});
});

/**
Description: Update a single Node and Return it
*/
app.put('/api/neo4j-js/:id',function(req,res){

	var id = req.params.id;
	var bodyMap = req.body;
	console.log("Request to Update Node, Params : id= " + id + ", Object = " + bodyMap);
	neo4j_js.connect(neo4j_js_url, function (err, graph) {
		graph.query(updateNode.join('\n'), { id: parseInt(id), n : bodyMap}, function(err,node){
			
			if (err) {
				console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
				res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
			}
			if(node){
				console.log("Response Code: " + HTTPStatus.OK + ", Data: " + node);
				res.status(HTTPStatus.OK).send(node);				
			}
			else {
				console.log("Response Code: " + HTTPStatus.NOT_FOUND);
				res.status(HTTPStatus.NOT_FOUND).send('NOT FOUND');
			}
		});
	});
});

/**
Description: Delete a single Node
*/
app.delete('/api/neo4j-js/:id',function(req,res){

	var id = req.params.id;	
	console.log("Request to Delete Node, Params : id= " + id);
	neo4j_js.connect(neo4j_js_url, function (err, graph) {
		graph.deleteNode(id, function(err){
			
			if (err) {
				console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
				res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
			}
				console.log("Response Code: " + HTTPStatus.OK);
				res.status(HTTPStatus.OK).send("Node "+ id +" successfully deleted!!!");
		});
	});
});
/* -----------NEO4J-JS Rest CRUD APIs--------- */
/* ------------------------------------------------------------------------------------------------------------------------------------- */

var server = app.listen(1212, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('App listening at http://%s:%s', host, port)

})