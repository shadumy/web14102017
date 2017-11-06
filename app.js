var express = require('express')
var app = express()
app.listen(2000)
app.engine('html',require('ejs').renderFile)

app.get('/',showTime, showHome) //เป็นวิธีเรียก middleware วิธีแรก เอาฟังก์ชันไว้ตรงกลาง

/*
app.get('/',showHome) 
app.use(showTime) 
เป็นวิธีเรียก middleware อีกวิธี แต่แบบบนเห็นว่าดีกว่า?
*/
//app.get('/product',showProduct)
//app.get('/about',showPrice)

app.get('/start',showStart)
app.get('/total',showTotal)
app.get('/login',showLoginPage)

var bodyModule = require('body-parser') //load module
var body=bodyModule({extended: false}) //สร้าง middleware
var valid=[]
app.post('/login',body, checkPassword)

function checkPassword(req, res){
    if(req.body.email == 'mark@fb.com' && 
       req.body.password == 'mark123'){
            var card = createCard()
            valid[card]='OK'
            res.set('Set-Cookie','card='+card)
            res.redirect('/profile')
       }else{
            res.redirect('/login')
       }   
}
function createCard(){
    return parseInt(Math.random()*100000)
}

var cookieModule = require('cookie-parser')
var cookie = cookieModule()

app.get('/profile',cookie,showProfile)

function showProfile(req,res){
    var card = null
    if(req.cookies != null && req.cookies.card != null){
        card = req.cookies.card
    }
    if(valid[card]){
        res.render('profile.html')
    }else{
        res.redirect('/login')
    }
}

app.get('/logout',cookie, showLogOutPage)

function showLogOutPage(req,res){
    var card = null
    if(req.cookies && req.cookies.card){
        card = req.cookies.card
    }
    delete valid[card]
    res.render('logout.html')
}

app.use(express.static('public'))

//middleware ตัวสุดท้ายใข้แสดง error ไม่ต้องเรียก next()
app.use(showError)

function showError(req, res){
    res.send('<i>ไม่มีหน้านี้โว้ยยยยยย 404 not found という意味ですよ</i>')
}

function showHome(req,res){
    res.render('index.html')
}

//Middleware คือฟังก์ชันที่ถูกเรียกก่อนฟังก์ชันปกติ
function showTime(req, res, next){
    console.log(new Date()) //พิมพ์เวลาปัจจุบัน
    next() //เรียกฟังก์ชันถัดไป
}

function showStart(req,res){
    res.render('index2.html')
}

function showTotal(req,res){
    var n = req.query.price
    var r=n

    if(n>=100){
        r=n*0.95
    }
    
    //res.send('Total is '+r)
    res.render('total.html',{result: r})
}

function showLoginPage(req,res){
    res.render('login.html')
}