const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const marketplaceRoutes = require('./routes/marketplace');

const app = express();

app.use(express.json());

app.use(session({
  secret: 'tradingarea-secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Steam Login Setup (Dummy, kann später mit echten
