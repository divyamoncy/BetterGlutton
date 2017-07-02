const express=require('express')
const app=express()

app.use(express.static('static'))

var Datastore=require('nedb')
var db=new Datastore({filename:'restau.db',autoload:true});
var bb=new Datastore({filename:'blog.db',autoload:true})

app.set('port',process.env.PORT||5000);

app.set('view engine','ejs');

app.get('/',function (req,res) {
res.render('home');
})

app.get('/rate',function (req,res) {
	res.render('rate');
})
app.get('/ranking',function(req,res){
	db.find({},function(err,resul){
		
res.render('ranking',{resul});
})

})

app.get('/rateSubmit',function (req,res) {
	var m=req.query.me
	var n=req.query.name
	var a=Number(req.query.ambience[0])
	var t=Number(req.query.ambience[1])
	var s=Number(req.query.ambience[2])
	var T=a+t+s

	var rest={
		"me":m,
		"name":n,
		"ambience":a,
		"taste":t,
		"service":s,
		"total":T};

db.insert(rest,function(err,result){
	
	})
	db.find({},function(err,resul){
		
res.render('ranking',{resul});

})

})
app.get('/search',function(req,res){
	var a=req.query.namee;
	
	res.redirect('/searchSubmit/'+a);})


app.get('/searchSubmit/:namee',function(req,res){
	var a=req.params.namee;
	var reso;
	bb.find({name:a},function(err,r){
		reso=r;
	})

	db.find({name:a},function(err,result){
		
		if(result.length!=0){
			
			res.render('indiv',{res:result,reso});
			
		
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


app.get('/blogSubmit',function(req,res){
	var a=req.query.me;
	var b=req.query.name;
	var c=req.query.opinion;
	var blogpost={
		"me":a,
		"name":b,
		"opinion":c
	};
	bb.insert(blogpost,function(err,res){
		
	})
 
 bb.find({},function(err,result){
 	if(result.length>0)
 	{
 		res.render('blogView',{result});
 	}

 	else{
 		res.send('No blogs have been entered yet.')
 	}
 })
})
app.get('/blogView',function (req,res) {
	 bb.find({},function(err,result){
 	if(result.length>0)
 	{
 		res.render('blogView',{result});
 	}

 	else{
 		res.send('No blogs have been entered yet.')
 	}
 })
	})




app.listen(app.get('port'),function(){
	console.log('GLUTTON is listening');
})