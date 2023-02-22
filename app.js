const express=require('express');
const bodyParser=require('body-parser');
const date=require(__dirname+"/date.js");


const { urlencoded } = require('body-parser');
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
let newItemArray=[];
let newWorkListArray=[];


app.get("/",function(req,res){
    let day=date.getDay();
    res.render('list',{day:day,title:"Home List",newItemArray:newItemArray});
});

app.get("/work",function(req,res){
    let day=date.getDay();
    res.render('list',{day:day,title:"Work List",newItemArray:newWorkListArray});
})
app.get("/about",function(req,res){
    res.render("about");
})

app.post("/",function(req,res){
    let newItem=req.body.newItem;
 if(req.body.button==="Home"){
    newItemArray.push(newItem);
    res.redirect('/');
 }else{
    newWorkListArray.push(newItem);
    res.redirect("/work");
 }
   

})

app.listen(process.env.PORT||3000,function(){
    console.log("listening in port 3000");
})
