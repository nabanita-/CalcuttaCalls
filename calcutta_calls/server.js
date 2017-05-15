var express = require('express');
var path = require('path');
var mysql = require('mysql');
var session = require('client-sessions');

var favicon = require('serve-favicon');
var http = require('http');
var app = express();
var connection  = require('express-myconnection'); 
var contacts=require('./routes/contact');

app.use(
    connection(mysql,{
       host     : 'sql5.freemysqlhosting.net',
       user     : 'sql576084',
       password : 'mB4*yV9!',
       database : 'sql576084'
    },'request')
);

app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(function(req,res,next){
	console.log('Request Type :' + req.method + " Url : "+ req.originalUrl);
	next();
});
//app.set('view engine', '');

if ('development' == app.get('env'))
{
  app.use(express.errorHandler());
}
*/
app.use(session({
  cookieName: 'session',
  secret: 'eatmyshorts',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

function authUser(req,res,next){
    if (req.session && req.session.user) { // Check if session exists
		    // lookup the user in the DB by pulling their email from the session
		    var username = req.session.user.username;
		    console.log(username);
		  req.getConnection(function(err,connection){
		      if(err){
		          console.log("Error %s",err);
		      }
		    connection.query('SELECT * FROM admin WHERE user = ?',[username],function(err,user){
		    	if(err){
		          console.log("Error %s",err);
		      }
		    	console.log(user);
		      if (user===null) {
		        // if the user isn't found in the DB, reset the session info and
		        // redirect the user to the login page
		        req.session.reset();
		        res.redirect('/login');
		      } else {
		        // expose the user to the template
		        res.locals.user = user;

		        // render the dashboard page
		        next();
		      }
		    });
		  });
		  } else {
		    res.redirect('/login');
		  }
}



app.get('/',function(req,res){
  res.render('index');
});
app.get('/contacts/add', contacts.add);
app.post('/contacts/add', contacts.save);
app.get('/contacts', contacts.list);
app.get('/contacts/edit/:phone',authUser, contacts.edit); 
app.post('/contacts/edit/:phone',contacts.save_edit);


app.get('/login',function(req, res) {
    res.render('login');
});
app.get('/contacts/admin',authUser,contacts.admin);

app.post('/login', function(req,res){
	var username = req.body.username;
	req.getConnection(function(err,connection){
		if(err){
		          console.log("Error %s",err);
		      }
		console.log("hi");
	connection.query('SELECT * FROM admin WHERE user = ?',[username],function(err,user){
  	if(err){
		          console.log("Error %s",err);
		      }
  	console.log(user);
    if (user[0]==null) {
    	console.log("hello");
      	res.redirect('/login');
    }else {
    	console.log(req.body.password+"==="+user[0].password);
      if (req.body.password === user[0].password) {
      	console.log("If : true");
      	req.session.user = user;
        res.redirect('/contacts/admin');
      } else {
      	console.log('Invalid');
        res.redirect('/login');
      }
    }
  });
});
});
app.get('/logout', function(req, res) {
    req.session.reset();
    res.send("You have been successfully logged out...");
})
app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

