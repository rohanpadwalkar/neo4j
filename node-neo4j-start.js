var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    HTTPStatus = require('http-status'),
    bodyParser = require('body-parser'),
    app = express(),
    moment = require('moment'),
    config = require('./config'),
    node_neo4j = require('node-neo4j'),
    node_neo4j_url = process.env.NEO4J_URL,
    node_neo4j_db = new node_neo4j(node_neo4j_url);

//configure app
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');



app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(path.join(__dirname,'bower_components')));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

//Custom Queries
var getAllNodes = ['START n=node(*) RETURN n '];

/* ------------------------------------------------------------------------------------------------------------------------------------- */
/* -----------NODE-NEO4j Rest CRUD APIs--------- */

/**
Description: Create Any Node and Return it
*/


app.post('/api/node-neo4j/node/', function(req, res) {

    var bodyMap = req.body;
    console.log("Request to Create Node, Params: = " + bodyMap);
    node_neo4j_db.insertNode(bodyMap, function(err, node) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        } else {
            console.log("Response Code: " + HTTPStatus.OK + ", Node: " + node._id + "Create Successfully!!!");
            res.status(HTTPStatus.OK).send(node);

        }
    });
});

/**
Description: Get a single Node and Return it
*/
app.get('/api/node-neo4j/node/:id', function(req, res) {

    var id = req.params.id;
    console.log("Request to get Node, Params: id = " + id);

    var date1 = moment().millisecond();
    console.log("Date1 : " + date1);

    node_neo4j_db.readNode(id, function(err, node) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        } else if (node === false) {
            console.log("Response Code: " + HTTPStatus.NOT_FOUND);
            res.status(HTTPStatus.NOT_FOUND).send('Node ' + id + ' NOT FOUND');
        } else {
            
            res.render('detail',{
                
                 title:'My App',
                 items:node //hav passed database result to the page nd trying to print it on index page views/index.ejs
                     //so tht index page ll show all a stin li
          });
            console.log("Response Code: " + HTTPStatus.OK + ", Data: " + node);

            var date2 = moment().millisecond();
            console.log("Date2 : " + date2);
            console.log("Request time:- " + (date2 - date1));

            

        }
    });
});

/* return all nodes */
app.get('/',function(req,res){
   node_neo4j_db.cypherQuery("MATCH  p=(a)-->(m) RETURN DISTINCT a;", function(err, nodes) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
       else{
//           console.log(nodes);
         res.render('index',{
         title:'My App',
         items:nodes //hav passed database result to the page nd trying to print it on index page views/index.ejs
             //so tht index page ll show all a stin li
          });
       }
    });
});

/*
app.get('/',function(req,res){
   node_neo4j_db.cypherQuery("MATCH  p=(a)-->(m) RETURN DISTINCT a;", function(err, nodes) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
       else{
           console.log(nodes);
         res.send(nodes);
       }
    });
});
*/

app.get('/create',function(req,res){
    
    var name = req.params.name;
   
    
         node_neo4j_db.insertNode({name: 'rohan',sex: 'male' },function(err, node){
             if (err) {
                        console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
                        res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
                    }
            // Output node properties.
            console.log(node.data);

            // Output node id.
            console.log(node._id);
             res.send(node.name);
        });
});



/**
Description: Delete a single Node
*/
app.get('/delete/:id', function(req, res) {

    var id = req.params.id;
    
    console.log("Request to Delete Node, Params : id= " + id);
    
    node_neo4j_db.deleteNode(id, function(err, node) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.send('Internal Server Error');
            
        }
        if (node === true) {
            console.log("Response Code: " + HTTPStatus.OK);
            res.send("Node " + id + " successfully deleted!!!");
            
            
            
        } else {
            console.log("Response Code: " + HTTPStatus.NOT_FOUND);
            res.send('NOT FOUND');
           
        }
    });
    return res.redirect('/');
});



/**
Description: Get All Node and Returns them ----------------------------------------------here is main
*/
app.get('/api/node-neo4j/node/', function(req, res) {

    console.log("Request to get All Node");

    var date1 = moment().millisecond();
    console.log("Date1 : " + date1);

    node_neo4j_db.cypherQuery("START n=node(*) RETURN n ", function(err, nodes) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
        console.log("Response Code: " + HTTPStatus.OK + ", Data: " + nodes);

        var date2 = moment().millisecond();
        console.log("Date2 : " + date2);
        console.log("Request time:- " + (date2 - date1));

        res.status(HTTPStatus.OK).send(nodes);
    });
});

/**
Description: Update a single Node and Return it
*/
app.put('/api/node-neo4j/node/:id', function(req, res) {

    var id = req.params.id;
    var bodyMap = req.body;
    console.log("Request to Update Node, Params : id= " + id + ", Object = " + bodyMap);
    node_neo4j_db.updateNode(parseInt(id), bodyMap, function(err, node) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
        if (node === true) {
            console.log("Response Code: " + HTTPStatus.OK + ", Node: " + node._id + "Updated Successfully");
            res.status(HTTPStatus.OK).send("Node " + id + "Successfully Updated!!!");
        } else {
            console.log("Response Code: " + HTTPStatus.NOT_FOUND);
            res.status(HTTPStatus.NOT_FOUND).send('NOT FOUND');
        }
    });
});

/**
Description: Create Any Relationship and Return it
*/
app.post('/api/node-neo4j/relationship', function(req, res) {

    var first_friend = req.body.first_friend;
    var relationship_type = req.body.relationship_type;
    var relationship = req.body.relationship;
    var second_friend = req.body.second_friend;
    console.log("Request to Create Relationship " + relationship_type + " : " + relationship + " between first node " + first_friend + " and second node " + second_friend);
    node_neo4j_db.insertRelationship(first_friend, second_friend, relationship_type, relationship, function(err, relationshipNode) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        } else {
            console.log("Response Code: " + HTTPStatus.OK + ", Relationship: " + relationshipNode._id + " Create Successfully!!!");
            res.status(HTTPStatus.OK).send(relationshipNode);

        }
    });
});

/**
Description: Get a single Relationship and Return it
*/
app.get('/api/node-neo4j/relationship/:id', function(req, res) {

    var id = req.params.id;
    console.log("Request to Get Relationship id: " + id);
    node_neo4j_db.readRelationship(id, function(err, relationshipNode) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        } else {
            console.log("Response Code: " + HTTPStatus.OK + ", Relationship Id: " + relationshipNode._id + ", Relationship Data: " + relationshipNode);
            res.status(HTTPStatus.OK).send(relationshipNode);

        }
    });
});

/**
Description: Get All Relationship and Returns them
*/
app.get('/api/node-neo4j/relationship', function(req, res) {

    console.log("Request to get All Relationship");

    var date1 = moment().millisecond();
    console.log("Date1 : " + date1);

    node_neo4j_db.cypherQuery("START r=rel(*) RETURN r ", function(err, relationships) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
        console.log("Response Code: " + HTTPStatus.OK + ", Data: " + relationships);

        var date2 = moment().millisecond();
        console.log("Date2 : " + date2);
        console.log("Request time:- " + (date2 - date1));

        res.status(HTTPStatus.OK).send(relationships);
    });
});

/**
Description: Update a single Relationship and Return it
*/
app.put('/api/node-neo4j/relationship/:id', function(req, res) {

    var id = req.params.id;
    var bodyMap = req.body;
    console.log("Request to Update Relationship, Params : id= " + id + ", Object = " + bodyMap);
    node_neo4j_db.updateRelationship(parseInt(id), bodyMap, function(err, relationshipNode) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
        if (relationshipNode === true) {
            console.log("Response Code: " + HTTPStatus.OK + ", Relationship: " + relationshipNode._id + " Updated Successfully");
            res.status(HTTPStatus.OK).send("Relationship " + id + " Successfully Updated!!!");
        } else {
            console.log("Response Code: " + HTTPStatus.NOT_FOUND);
            res.status(HTTPStatus.NOT_FOUND).send('NOT FOUND');
        }
    });
});


/**
Description: Delete a single Relationship
*/
app.delete('/api/node-neo4j/relationship/:id', function(req, res) {

    var id = req.params.id;
    console.log("Request to Delete Relationship, Params : id= " + id);
    node_neo4j_db.deleteRelationship(id, function(err, relationship) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
        if (relationship === true) {
            console.log("Response Code: " + HTTPStatus.OK);
            res.status(HTTPStatus.OK).send("Relationship " + id + " successfully deleted!!!");
        } else {
            console.log("Response Code: " + HTTPStatus.NOT_FOUND);
            res.status(HTTPStatus.NOT_FOUND).send('Relationship ' + id + 'NOT FOUND');
        }
    });
});

/**
Description: Get All Related Nodes of Node and Return it
*/
app.get('/api/node-neo4j/node/:id/relatednode', function(req, res) {

    var _Id = req.params.id;
    var relationshipTypes = ":".concat(req.query['relationship_types']);
    var _RelationshipTypesArray = relationshipTypes.replace(",", "|:");
    console.log("Request to Get All Related Nodes of Node id: " + _Id + ", and Relationship Type : " + _RelationshipTypesArray);
    var relatedNodesQuery = "start n=node(" + _Id + ") match n-[" + _RelationshipTypesArray + "]->r return r";
    console.log("Query:- " + relatedNodesQuery);
    node_neo4j_db.cypherQuery(relatedNodesQuery, function(err, relatedNodes) {
        if (err) {
            console.log("Response Code: " + HTTPStatus.INTERNAL_SERVER_ERROR);
            res.status(HTTPStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        } else {
            console.log("Response Code: " + HTTPStatus.OK + ", Related Notes Data: " + relatedNodes);
            res.status(HTTPStatus.OK).send(relatedNodes);

        }
    });
});


/* -----------NODE-NEO4j Rest CRUD APIs--------- */

var server = app.listen(1212, function() {

    var host = server.address().address
    var port = server.address().port

    console.log('App listening at http://%s:%s', host, port)

})