var express        = require("express");
    application    = express();
    http           = require("http");
    passapp       = require("passport");
    util           = require("util");
    GitStrat = require("passport-github").Strategy;
    morgan         = require("morgan");
    session        = require("express-session");
    bodyParser     = require("body-parser");
    cookieParser   = require("cookie-parser");
    methodOverride = require("method-override");
    mongoose       = require("mongoose");

var authConfig = require("./config/auth");

passapp.serializeUser(function(user, done) {
  done(null, user);
});

passapp.deserializeUser(function(obj, done) {
  done(null, obj);
});

passapp.use(new GitStrat({
    clientID: authConfig.clientID,
    clientSecret: authConfig.clientSecret,
    callbackURL: authConfig.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

application.use(express.static(__dirname + '/client'));
application.set('views', __dirname + '/client/html');
application.use(morgan("combined"));
application.use(cookieParser());
application.use(bodyParser.urlencoded({ extended: false}));
application.use(methodOverride());
application.use(session({ 
  secret: authConfig.sessionSecret,
  resave: false,
  saveUninitialized: true
}));

application.use(passapp.initialize());
application.use(passapp.session());

var dbConfig = require("./config/db");
mongoose.connect(dbConfig.url);
var api = require("./routes/api");
var auth = require("./routes/auth");
var routes = require("./routes/routes");

application.use("/api", api);
application.use("/auth", auth);
application.use("/", routes);

application.use(function(req, res){
    res.sendStatus(404);
});

var server = http.createServer(application);

server.listen(process.env.PORT || 3100, process.env.IP || "0.0.0.0", function() {
  var address = server.address();
  console.log("Server is now started on ", address.address + ":" + address.port);
});

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});
