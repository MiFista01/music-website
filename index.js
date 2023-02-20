const {Op, Sequelize} = require('sequelize');
const db = require("./connection/database")
const Album = require("./models/Album")
const Favourites = require("./models/Favourites")
const Performer = require("./models/Performer")
const Genre = require("./models/Genre")
const TrackGenre = require("./models/Track_genre")
const Track = require("./models/Track")
const TrackPlayList = require("./models/Track_PlayList")
const PlayList = require("./models/PlayList")
const User = require("./models/User")
const Who = require("./models/Who")
// db.sync({alter:true})

let bcrypt = require("bcrypt")
var express = require("express"); 
var app = express();
const uuid = require('uuid').v4  



const cookieParser = require("cookie-parser");
const sessions = require('express-session');
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 12;

//session middleware
app.use(sessions({
    
    secret: "marsel",
    saveUninitialized:true,
    resave: false
}));
// ===================settings============================
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
const bodyParser = require('body-parser');
const sequelize = require('./connection/database');
app.use(bodyParser.json({limit: "4000mb"}));
app.use(bodyParser.urlencoded({limit: "4000mb", extended: true, parameterLimit:5000000}));
// ===================settings============================

let year = new Date(Date.now()).getFullYear();

User.findOne({where:{nick:"admin"}}).then(async (result) => {
    if(result == null){
        let nick = "admin"
        let salt = await bcrypt.genSalt(10)
        let password =await bcrypt.hash("1234",salt)
        User.create({nick, password, salt})
    }
}).catch((err) => {
    
});

app.get('/', async function(req, res){ 
    let hits = []
    let tracks = await Track.findAll({orders:"DESC", limit:10})
    for (i of tracks){
        let music = {}
        music.track = i;
        let img = await Album.findOne({where:{id:i.albumId}})
        music.img = img.img
        let performer = await Performer.findOne({attributes:["name"], where:{id:img.performerId}})
        music.performer = performer.name
        hits.push(music)
    }
    let playlists = await PlayList.findAll({order:sequelize.random(), limit:5})
    let genres = await Genre.findAll()
    let user
    let admin
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
        }else{
            admin = false
        }
    }
    res.render('pages/index',{author: req.session.author, year, hits, playlists, genres, user, admin, search:"page"});
})
app.get('/genre/:title', async function(req, res){
    let genre = await Genre.findOne({where:{title:req.params.title}})
    let genres = await Genre.findAll()
    let track_genre = await TrackGenre.findAll({where:{genreId:genre.id}})
    let albumsIds = []
    for (let i of track_genre){
        let track = await Track.findOne({where:{id:i.trackId}})
        albumsIds.push(track.albumId)
    }
    let albums = await Album.findAll({where:{id:albumsIds}})
    for (let i of albums){
        let performer = await Performer.findOne({where:{id:i.performerId}})
        i.performerName = performer.name
    }
    let user
    let admin
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
        }else{
            admin = false
        }
    }
    res.render('pages/genre',{author: req.session.author, genres, genre:req.params.title, albums, user, admin, search:"no page"});
})
app.get('/profile/:nick', async function(req, res){
    let user
    let admin
    let genres = await Genre.findAll()
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        
        if (user.nick == "admin"){
            admin = true
        }else{
            admin = false
        }
        if (req.params.nick == user.nick){
            res.render('pages/profile',{author: req.session.author, genres, user, admin, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    
})
app.get('/:nick/favorites', async function(req, res){
    let user
    let admin
    let genres = await Genre.findAll()
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        
        if (user.nick == "admin"){
            admin = true
        }else{
            admin = false
        }
        if (req.params.nick == user.nick){
            let favorites_tracks = []
            let favorites = await Favourites.findAll({where:{userid:req.session.userId}, attributes:["id"]})
            let favoritesIds = []
            for(let i of favorites){
                favoritesIds.push(i.id)
            }
            let tracks = await Track.findAll({where:{id:favoritesIds}})
            for(let i of tracks){
                let music = {}
                music.track = i
                music.img = await Album.findOne({where:{id:i.albumId}})
                favorites_tracks.push(music)
            }
            res.render('pages/favorites',{author: req.session.author, genres, user, admin, favorites_tracks, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
    
})
app.get('/album/:id', async function(req, res){
    let tracks = await Track.findAll({where:{albumId:req.params.id}})
    let album = await Album.findOne({where:{id:req.params.id}})
    let performer = await Performer.findOne({where:{id:album.performerId}})
    let genres = await Genre.findAll()
    let user
    let admin
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
        }else{
            admin = false
        }
    }
    res.render('pages/album',{author: req.session.author, genres, user, admin, tracks, album,performer, search:"no page"});
})
app.get('/playlist/:id', async function(req, res){
    let playlist = await PlayList.findOne({where:{id:req.params.id}})
    let tracksIds = []
    let tarcks_palylist = await TrackPlayList.findAll({where:{playlistId:req.params.id}})
    for(let i of tarcks_palylist){
        tracksIds.push(i.id)
    }
    let tracks = await Track.findAll({where:{id:tracksIds}})
    for (let i of tracks){
        let album = await Album.findOne({where:{id:i.id}})
        let performer = await Performer.findOne({where:{id:album.performerId}})
        i.performer = performer
    }
    let genres = await Genre.findAll()
    let user
    let admin
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
        }else{
            admin = false
        }
    }
    res.render('pages/playlist',{author: req.session.author, genres,tracks, playlist, user, admin, search:"no page"});
})
app.post('/login', async function(req, res){
    let user = await User.findOne({where:{nick:req.body.nick}})
    if (user == null){
        res.send({status:0})
    }else{
        let password = await bcrypt.hash(req.body.password, user.salt)
        if (password == user.password){
            req.session.author = true
            req.session.userId = user.id
            res.send({status:1})
        }else{
            res.send({status:0})
        }
    }
})
app.post('/logout', async function(req, res){
    req.session.destroy();
    res.send({status: 1})
})
app.post('/reg', async function(req, res){
    let user = await User.findOne({where:{nick:req.body.nick}})
    if (user == null && req.body.nick.length >= 5){
        if(req.body.password.length >= 5){
            let salt = await bcrypt.genSalt(10)
            let password = await bcrypt.hash(req.body.password, salt)
            let createUser = await User.create({nick:req.body.nick, password, salt})
            req.session.author = true
            req.session.userId = createUser.id
            res.send({status:1})
        }else{
            res.send({status:0, cause:"Short password, must be more than 5 characters"})
        }
    }else{
        res.send({status:0, cause:"Nickname exists or is it short"})
    }
})
app.post('/change_profile', async function(req, res){ 
    try {
        let user = await User.findOne({where:{id:req.session.userId}})
        if(req.body.password.length >= 5){
            let salt = await bcrypt.genSalt(10)
            let password = await bcrypt.hash(req.body.password, salt)
            user.update({password, salt})
        }
        if(req.body.nick != null && req.body.nick.length >= 5 && req.body.nick != user.nick){
            user.update({nick:req.body.nick})
        }
        res.send({status:1})
    } catch (error) {
        res.send({status:0})
    }
    
})
app.get('/session/destroy', async function(req, res){
    req.session.destroy();
})
app.all('*', async function(req, res){
    let user
    let admin
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
        }else{
            admin = false
        }
    }
    res.render('pages/error',{admin});
})
app.listen(3000); 