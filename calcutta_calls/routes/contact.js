exports.add = function(req, res){
  res.render('add',{page_title:"Add Contact"});
};

exports.list = function(req, res){
  req.getConnection(function(err,connection){
      if(err)
           console.log("Error in Connection : %s ",err );
       
     connection.query('SELECT * FROM contact',function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
            res.render('contact.ejs',{page_title:"Phone Directory",data:rows});
                           
         });
       
    });
  
};


exports.admin = function(req, res){
  req.getConnection(function(err,connection){
      if(err)
           console.log("Error in Connection : %s ",err );
       
     connection.query('SELECT * FROM contact',function(err,rows)     {
            
        if(err)
           console.log("Error Selecting : %s ",err );
     
            res.render('admin.ejs',{page_title:"ADMIN",data:rows});
                           
         });
       
    });
  
};

exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        if (err)
              console.log("Error inserting : %s ",err );
         
        
        var data = {
            
            fname    : input.fname,
            lname : input.lname,
            email   : input.email,
            address : input.address,
            pincode : input.pincode,
            phoneno : input.phone,
            profession : input.profession
        };
        
        var query = connection.query("INSERT INTO contact set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         console.log('I made it ;)');
          res.redirect('/contacts');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.edit = function(req, res){
  console.log("Entered");
    
  var phone = req.params.phone;
    
  req.getConnection(function(err,connection){
      if(err)
                console.log("Error Selecting : %s ",err );
       
     connection.query('SELECT * FROM contact WHERE phoneno = ?',[phone],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit',{page_title:"Edit Contact",data:rows});
                           
         });
                 
    }); 
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var phone = req.params.phone;
    
    req.getConnection(function (err, connection) {
         if (err)
              console.log("Error in Connection: %s ",err );
        var data = {
            
            fname   : input.fname,
            lname   : input.lname,
            email   : input.email,
            address : input.address,
            pincode : input.pincode,
            phoneno : input.phone,
            profession:input.profession
        
        };
        
        connection.query("UPDATE contact set ? WHERE phoneno = ? ",[data,phone], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/contacts');
          
        });
    
    });
};