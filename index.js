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
// db.sync({alter:true})
const formidable = require('formidable')

let bcrypt = require("bcrypt")
var express = require("express"); 
var app = express();
var fs = require('fs');
const path = require('path');
var multer = require("multer");
const img_storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // '/files' это директория в которую будут сохранятся файлы 
      if(req.url != "/playlist_add"){
        cb(null, 'public/imgs/albums/'+req.body.performer.split(" ")[0].toLowerCase())
      }
      else{
        cb(null, 'public/imgs/playlists')
      }
    },
    filename: (req, file, cb) => {
  // Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
      const { originalname } = file
      cb(null, originalname)
    }
})

const img_upload = multer({ storage: img_storage })

const music_storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        // '/files' это директория в которую будут сохранятся файлы
        let album = await Album.findOne({where:{title:req.body.album}})
        let performer = await Performer.findOne({where:{id:album.performerId}})
        cb(null, 'public/music/'+performer.directory)
    },
    filename: (req, file, cb) => {
  // Возьмем оригинальное название файла, и под этим же названием сохраним его на сервере
      const { originalname } = file
      cb(null, originalname)
    }
})

const music_upload = multer({ storage: music_storage })

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
const { type } = require('os');
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
    let tracks = await Track.findAll({orders:"DESC", limit:7})
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
        for(let i of tracks){
            let favorites = await Favourites.findOne({where:{trackId:i.id, userId:req.session.userId}})
            if (favorites == null){
                i.fav = "off"
            }else{
                i.fav = "on"
            }
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
        i.performer = performer.name
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
        for(let i of tracks){
            let favorites = await Favourites.findOne({where:{trackId:i.id, userId:req.session.userId}})
            if (favorites == null){
                i.fav = "off"
            }else{
                i.fav = "on"
            }
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
app.get('/manager_performer', async function(req, res){
    let admin
    let user
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
            let genres = await Genre.findAll()
            let performers = await Performer.findAll()
            res.render('pages/performer',{author: req.session.author, genres, performers, user, admin, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
})
app.post('/get_form_performer', async function(req, res){ 
    if(req.body.form == "add"){
        res.render('fragments/add_performer')
    }else{
        if(req.body.form == "update"){
            let performer = await Performer.findOne({where:{id:req.body.id}})
            res.render('fragments/update_performer',{performer})
        }
    }
})
app.post('/performer_add',img_upload.single("img") ,[] , async function(req, res){
    try {
        let dir_exist = fs.existsSync("./public/music/"+req.body.name.split(" ")[0].toLowerCase())
        let dir_exist_imgs = fs.existsSync("./public/imgs/albums/"+req.body.name.split(" ")[0].toLowerCase())
        let data = req.body
        console.log(req.body)
        data.directory = req.body.name.split(" ")[0].toLowerCase()
        let performer = await Performer.create(data)
        if(!dir_exist){
            fs.mkdirSync("./public/music/"+req.body.name.split(" ")[0].toLowerCase());
        }
        if(!dir_exist_imgs){
            fs.mkdirSync("./public/imgs/albums/"+req.body.name.split(" ")[0].toLowerCase());
        }
        res.send({status:1})
    } catch (error) {
        res.send({status:0})
    }
    

})
app.post('/performer_update',img_upload.single("img") ,[] , async function(req, res){ 
    let performer = await Performer.findOne({where:{id:req.body.id}})
    if(performer != null){
        delete req.body.id
        performer.update(req.body)
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/performer_remove', async function(req, res){ 
    let performer = await Performer.findOne({where:{id:req.body.id}})
    if(performer != null){
        await performer.destroy()
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.get('/manager_genres', async function(req, res){
    let admin
    let user
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
            let genres = await Genre.findAll()
            res.render('pages/genre_manager',{author: req.session.author, genres, user, admin, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
})
app.post('/get_form_genre', async function(req, res){ 
    if(req.body.form == "add"){
        res.render('fragments/add_genre')
    }else{
        if(req.body.form == "update"){
            let genre = await Genre.findOne({where:{id:req.body.id}})
            res.render('fragments/update_genre',{genre})
        }
    }
})
app.post('/genre_add',img_upload.single("img") ,[] , async function(req, res){
    try {
        let genre = await Genre.create({title:req.body.title.toUpperCase()})
        res.send({status:1})
    } catch (error) {
        res.send({status:0})
    }
    

})
app.post('/genre_update',img_upload.single("img") ,[] , async function(req, res){ 
    let genre = await Genre.findOne({where:{id:req.body.id}})
    if(genre != null){
        genre.update({title:req.body.title.toUpperCase()})
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/genre_remove', async function(req, res){ 
    let genre = await Genre.findOne({where:{id:req.body.id}})
    if(genre != null){
        await genre.destroy()
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.get('/manager_albums', async function(req, res){
    let admin
    let user
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
            let genres = await Genre.findAll()
            let albums = await Album.findAll()
            res.render('pages/album_manager',{author: req.session.author, genres, albums, user, admin, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
})
app.post('/get_form_album', async function(req, res){ 
    let performers = await Performer.findAll()
    if(req.body.form == "add"){
        res.render('fragments/add_album',{performers})
    }else{
        if(req.body.form == "update"){
            let album = await Album.findOne({where:{id:req.body.id}})
            let performer = await Performer.findOne({where:{id:album.performerId}})
            album.performer = performer.name
            res.render('fragments/update_album',{album, performers})
        }
    }
})
app.post('/album_add',img_upload.single("img") ,[] , async function(req, res){
    try {
        let performer = await Performer.findOne({where:{name:req.body.performer}})
        if(performer != null && req.file != undefined){
            let album = await Album.create({title:req.body.title, performerId:performer.id, year:req.body.year, img:req.file.destination.replace("public/", "")+"/"+req.file.filename})
            res.send({status:1})
        }else{
            res.send({status:0,text:"non-existent performer"})
        }
    } catch (error) {
        res.send({status:0})
    }
})
app.post('/album_update',img_upload.single("img") ,[] , async function(req, res){ 
    let album = await Album.findOne({where:{id:req.body.id}})
    console.log(album)
    if(album != null){ 
        delete req.body.id
        album.update(req.body)
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/album_remove', async function(req, res){ 
    let album = await Album.findOne({where:{id:req.body.id}})
    if(album != null){
        await album.destroy()
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.get('/manager_playlist', async function(req, res){
    let admin
    let user
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
            let genres = await Genre.findAll()
            let playlists = await PlayList.findAll()
            res.render('pages/playlist_manager',{author: req.session.author, genres, playlists, user, admin, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
})
app.post('/get_form_playlist', async function(req, res){ 
    let tracks = await Track.findAll()
    if(req.body.form == "add"){
        res.render('fragments/add_playlist',{tracks})
    }else{
        if(req.body.form == "update"){
            let playlist = await PlayList.findOne({where:{id:req.body.id}})
            res.render('fragments/update_playlist',{playlist, tracks})
        }
    }
})
app.post('/playlist_add',img_upload.single("img") ,[] , async function(req, res){
    try {
        if(req.file != undefined){
            let playlist = await PlayList.create({title:req.body.title, img:req.file.destination.replace("public/", "")+"/"+req.file.filename})
            res.send({status:1})
        }else{
            res.send({status:0,text:"non-existent playlist picture"})
        }
    } catch (error) {
        res.send({status:0})
    }
})
app.post('/playlist_update',img_upload.single("img") ,[] , async function(req, res){ 
    let playlist = await PlayList.findOne({where:{id:req.body.id}})
    if(playlist != null){ 
        delete req.body.id
        playlist.update(req.body)
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/playlist_remove', async function(req, res){ 
    let playlist = await PlayList.findOne({where:{id:req.body.id}})
    if(playlist != null){
        await playlist.destroy()
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.get('/manager_track', async function(req, res){
    let admin
    let user
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
            let genres = await Genre.findAll()
            let tracks = await Track.findAll()
            let albums = await Album.findAll()
            for (let i of tracks){
                let album =  await Album.findOne({where:{id:i.albumId}})
                i.img = album.img
            }
            res.render('pages/track_manager',{author: req.session.author, genres, tracks, albums, user, admin, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
})
app.post('/get_form_track', async function(req, res){ 
    let albums = await Album.findAll()
    if(req.body.form == "add"){
        res.render('fragments/add_track',{albums})
    }else{
        if(req.body.form == "update"){
            let track = await Track.findOne({where:{id:req.body.id}})
            res.render('fragments/update_track',{track,albums})
        }
    }
})
app.post('/track_add',music_upload.single("music") ,[] , async function(req, res){
    try {
        let album = await Album.findOne({here:{title:req.body.album}})
        if(req.file != undefined && album != null){
            let track = await Track.create({title:req.body.title, link:req.file.destination.replace("public/", "")+"/"+req.file.filename, albumId:album.id})
            res.send({status:1})
        }else{
            res.send({status:0,text:"non-existent music file"})
        }
    } catch (error) {
        res.send({status:0})
    }
})
app.post('/track_update',music_upload.single("music") ,[] , async function(req, res){ 
    let track = await Track.findOne({where:{id:req.body.id}})
    if(track != null){ 
        let data = {}
        data.title = req.body.title
        let album = await Album.findOne({where:{title:req.body.album}})
        data.albumId = album.id
        track.update(data)
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/tarck_remove', async function(req, res){ 
    let track = await Track.findOne({where:{id:req.body.id}})
    if(track != null){
        await track.destroy()
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/search_tracks', async function(req, res){ 
    let unq_tracks = new Set();
    let albums = await Album.findAll({where:{title:{[Op.substring]:req.body.name}}})
    for(let i of albums){
        let tracks = await Track.findAll({where:{albumId:i.id}})
        for(let j of tracks){
            j.img = i.img
            unq_tracks.add(j)
        }
    }
    const array = Array.from(unq_tracks)
    res.render("fragments/render_tracks_admin",{array})
})




app.get('/manager_tracks_playlist', async function(req, res){
    let admin
    let user
    if(req.session.userId != undefined){
        user = await User.findOne({where:{id:req.session.userId}})
        if (user.nick == "admin"){
            admin = true
            let genres = await Genre.findAll()
            let tracks = await Track.findAll()
            let albums = await Album.findAll()
            let playlists = await PlayList.findAll()
            for (let i of tracks){
                let album =  await Album.findOne({where:{id:i.albumId}})
                i.img = album.img
            }
            res.render('pages/tracks_playlist_manager',{author: req.session.author, genres, tracks, albums, playlists, user, admin, search:"no page"});
        }else{
            res.redirect("/")
        }
    }else{
        res.redirect("/")
    }
})
app.post('/get_form_track', async function(req, res){ 
    let albums = await Album.findAll()
    if(req.body.form == "add"){
        res.render('fragments/add_track',{albums})
    }else{
        if(req.body.form == "update"){
            let track = await Track.findOne({where:{id:req.body.id}})
            res.render('fragments/update_track',{track,albums})
        }
    }
})
app.post('/track_add',music_upload.single("music") ,[] , async function(req, res){
    try {
        let album = await Album.findOne({here:{title:req.body.album}})
        if(req.file != undefined && album != null){
            let track = await Track.create({title:req.body.title, link:req.file.destination.replace("public/", "")+"/"+req.file.filename, albumId:album.id})
            res.send({status:1})
        }else{
            res.send({status:0,text:"non-existent music file"})
        }
    } catch (error) {
        res.send({status:0})
    }
})
app.post('/track_update',music_upload.single("music") ,[] , async function(req, res){ 
    let track = await Track.findOne({where:{id:req.body.id}})
    if(track != null){ 
        let data = {}
        data.title = req.body.title
        let album = await Album.findOne({where:{title:req.body.album}})
        data.albumId = album.id
        track.update(data)
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/tarck_remove', async function(req, res){ 
    let track = await Track.findOne({where:{id:req.body.id}})
    if(track != null){
        await track.destroy()
        res.send({status:1})
    }else{
        res.send({status:0})
    }
})
app.post('/search_tracks', async function(req, res){ 
    let unq_tracks = new Set();
    let albums = await Album.findAll({where:{title:{[Op.substring]:req.body.name}}})
    for(let i of albums){
        let tracks = await Track.findAll({where:{albumId:i.id}})
        for(let j of tracks){
            j.img = i.img
            unq_tracks.add(j)
        }
    }
    const array = Array.from(unq_tracks)
    res.render("fragments/render_tracks_admin",{array})
})



app.post('/add_fav', async function(req, res){ 
    let favorites = await Favourites.create({trackid:req.body.id, userid:req.session.userId})
    res.send({status:1})
})
app.post('/remove_fav', async function(req, res){ 
    let favorites = await Favourites.destroy({where:{trackid:req.body.id, userid:req.session.userId}})
    res.send({status:1}) 
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