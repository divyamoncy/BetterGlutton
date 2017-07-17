const express=require('express')
const app=express()

app.use(express.static('static'))


var bodyParser=require('body-parser')
app.use(bodyParser())



//var Datastore=require('nedb')
//var db=new Datastore({filename:'restau.db',autoload:true});
//var bb=new Datastore({filename:'blog.db',autoload:true})
var mongojs=require('mongojs')
var db=mongojs('mongodb://<dburl>',['rates'])

app.set('port',process.env.PORT||5000);

app.set('view engine','ejs');

app.get('/',function (req,res) {
res.render('home');
})

app.get('/rate',function (req,res) {
	res.render('rate');
})
app.get('/ranking',function(req,res){
	db.rates.find({name:{"$exists": true}},function(err,resul){
		
res.render('ranking',{resul});
})

})

app.post('/rateSubmit',function (req,res) {
	var m=req.body.me
	var n=req.body.name
	var a=Number(req.body.ambience[0])
	var t=Number(req.body.ambience[1])
	var s=Number(req.body.ambience[2])
	var T=a+t+s

	var rest={
		"me":m,
		"name":n,
		"ambience":a,
		"taste":t,
		"service":s,
		"total":T};

db.rates.insert(rest,function(err,result){
	
	})
	res.redirect('/ranking')

})
app.post('/search',function(req,res){
	var a=req.body.namee;
	
	res.redirect('/searchSubmit/'+a);})


app.get('/searchSubmit/:namee',function(req,res){
	var a=req.params.namee;
	var reso;
	db.rates.find({resname:a},function(err,r){
		reso=r;
	})

	db.rates.find({name:a},function(err,result){
		
		
		if(result.length!=0){
			
			res.render('indiv',{res:result,reso:reso});

			
		
		}
		else
		{
			res.send("There is no restaurant with the given name. Please retry with a valid name.")
		}
	
	})

	
		
	})



app.get('/blog',function (req,res) {
res.render('blog');
})


app.post('/blogSubmit',function(req,res){
	var a=req.body.me;
	var b=req.body.name;
	var c=req.body.opinion;
	var blogpost={
		"me":a,
		"resname":b,
		"opinion":c
	};
	db.rates.insert(blogpost,function(err,res){
		
	})
 
 res.redirect('/blogView')
})
app.get('/blogView',function (req,res) {
	 db.rates.find({resname:{"$exists": true}},function(err,result){
 	if(result.length>0)
 	{
 		res.render('blogView',{result});
 	}

 	else{
 		res.send('No blogs have been entered yet.')
 	}
 })
	})




app.listen(3000,function(){
	console.log('GLUTTON is listening');
})	