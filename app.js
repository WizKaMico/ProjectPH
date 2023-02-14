const express = require('express'); 
const mysql = require('mysql'); 
const bodyParser = require('body-parser');
const app = express(); 
const port = process.env.PORT || 5001;  

app.use(bodyParser.urlencoded( { extended:false })); 
app.use(bodyParser.json()); 


const conn = mysql.createConnection({
    host : 'localhost', 
    user : 'root', 
    password : '', 
    database : 'project_ph'
})

app.post('/addCredentials', (req, res) => {
    function code_generator(min, max){
        return Math.floor(
            Math.random() * (min - max) + max
        )
    }

    const code = code_generator(6666,9999); 
    const email = req.body.email; 
    const password = req.body.password; 
    const fullname = req.body.fullname; 
    const status = "VALID"; 
   
    conn.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
        if(result.length > 0){

            res.send('User is already existing')
          
        }else{
            

            conn.query("INSERT INTO admin (email, password, fullname, code, status) VALUES (?,?,?,?,?)",[email, password, fullname, code, status], (err, result) => {
                if(err){
                    console.log(err)
                }else{
                    console.log(result); 
                    res.send('User Credentials Succesfully Inserted | EMAIL : ' + email + ' |  PASSWORD : ' + password + ' |  CODE : ' + code);
                }
            }); 

        }
    })

}); 

app.delete('/AccountRecover', (req, res) => {
    const email = req.body.email; 
  
    conn.query("DELETE FROM admin_login_error WHERE email = ?", [email], (err, result) => {
        if(err){
            console.log(err); 
        }else{
            console.log(result); 
            req.send(result);
        }
    })
})

app.post('/GenToken', (req, res) => {
    
    function gen_sec_token(min, max){
        return Math.floor(
            Math.random() * (min - max) + max
        )
    }

    const code = gen_sec_token(6666,9999); 
    const date_created = Date.now();
    const status = "VALID"; 
    const email = req.body.email; 
    const password = req.body.password; 

    conn.query("SELECT * FROM admin WHERE email = ? AND password = ? AND status = 'VALID'", [email, password], (err, result) => {
        if(result.length > 0){
             
            conn.query("INSERT INTO security_level (email, code, status, date_created) VALUES (?,?,?,?)", [email, code, status, date_created], (err, result) => {
                if (err) {
                    console.log(err)
                }else{
                    res.send("USER SECURITY CODE HAS BEEN GENERATED FOR | EMAIL " + email + " | CODE " + code + ""); 
                }
            })

        }else{
            console.log(err); 
            res.send("This user is not existing / else this user is still not valid")
        }
    })

}); 


app.listen(port, ()=> {
    console.log('App is litening to the port ' + port); 
})