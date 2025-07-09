const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let offers = []; // Beispiel-Daten: [{ id, title, user, price }]
let roles = {};  // z.B. { 'steamid123': 'banned' }

function isBanned(req) {
  return roles[req.user?.id] === 'banned';
}

// Middleware: Nur eingeloggte, nicht gesperrte Nutzer dürfen posten
function requireAuth(req, res, next) {
  if (!req.isAuthenticated?.()) return res.status(401).json({ message: 'Nicht eingeloggt' });
  if (isBanned(req)) return res.status(403).json({ message: 'Gesperrt' });
  next();
}

// GET: Alle Angebote abrufen
router.get('/', (req, res) => {
  res.json({ offers });
});

// POST: Neues Angebot erstellen
router.post('/create', requireAuth, (req, res) => {
  const { title, price } = req.body;
  if (!title || !price) return res.status(400).json({ message: 'Titel und Preis erforderlich' });

  const newOffer = {
    id: uuidv4(),
    title,
    price,
    user: req.user?.id || 'anonymous'
  };

  offers.push(newOffer);
  res.status(201).json({ success: true, offer: newOffer });
});

// POST: Angebot löschen (nur Ersteller oder Admin)
router.post('/delete', requireAuth, (req, res) => {
  const { id } = req.body;
  const index = offers.findIndex(o => o.id === id);

  if (index === -1) return res.status(404).json({ message: 'Nicht gefunden' });

  const offer = offers[index];
  const isOwner = offer.user === req.user?.id;
  const isAdmin = req.user?.id === 'denadmin';

  if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Nicht berechtigt' });

  offers.splice(index, 1);
  res.json({ success: true });
});

module.exports = router;
