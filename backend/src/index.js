const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5175', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Fallback in-memory data
let admins = [
  { id: 1, name: 'Admin Utama', email: 'admin@dreamwo.com', password: '$2b$10$giU4.CmTRGccdt0fdceXpeIE0uNhYatg35zC6fgbhO.b.IQQ3X.u2', phone: '08123456789', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let clients = [
  { id: 1, name: 'Kavleri', phone: '08123456789', email: 'kavleri@example.com', address: 'Jl. Contoh No. 123, Jakarta', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let events = [
  { id: 1, client_id: 1, groom_name: 'Andi', bride_name: 'Maya', event_date: '2026-06-15', location: 'Masjid Al-Husna Grand Ballroom', theme: 'Modern Syariah', status: 'Confirmed', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let bookings = [
  { id: 1, client_id: 1, event_id: 1, package_id: 2, total_amount: 50000000, status: 'Confirmed', notes: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let packages = [
  { id: 1, name: 'Bronze Package', sub_title: 'Intimate Sanctuary', category: 'Full', icon: 'stars', description: 'Paket pernikahan intim untuk 200 tamu', price: 15000000, features: ['Up to 200 Guests', 'Syariah Catering Basic', 'Standard Decor Theme', 'Documentation (1 Photographer)'], is_popular: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: 'Gold Package', sub_title: 'Grand Celebration', category: 'Full', icon: 'diamond', description: 'Paket pernikahan mewah untuk 1000 tamu', price: 50000000, features: ['Up to 1000 Guests', 'Premium Syariah Buffet', 'Full Custom Decor & Floral', 'Live Cinematic Documentation'], is_popular: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, name: 'Silver Package', sub_title: 'Elegant Gathering', category: 'Full', icon: 'workspace_premium', description: 'Paket pernikahan elegan untuk 500 tamu', price: 30000000, features: ['Up to 500 Guests', 'Deluxe Syariah Buffet', 'Semi-Custom Decor', 'Photo & Video Coverage'], is_popular: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let portfolio = [
  { id: 1, title: 'Al-Husna Grand Wedding', category: 'The Royal Ballroom', image_path: '/images/portfolio-ballroom.jpg' },
  { id: 2, title: 'Culinary Excellence', category: 'Halal Catering', image_path: '/images/portfolio-catering.jpg' },
  { id: 3, title: 'Outdoor Serenity', category: 'Garden Wedding', image_path: '/images/portfolio-outdoor.jpg' }
];
let vendors = [
  { id: 1, name: 'Luxe Halal Catering', category: 'Catering', icon: 'restaurant' },
  { id: 2, name: 'Bloom Syariah Floral', category: 'Floral', icon: 'local_florist' },
  { id: 3, name: 'Modest Moments Studio', category: 'Documentation', icon: 'camera_enhance' },
  { id: 4, name: 'Elegance Bridal Wear', category: 'Attire', icon: 'styler' }
];
let guests = [
  { id: 1, event_id: 1, name: 'Budi Santoso', phone: '08987654321', email: 'budi@example.com', address: '', status: 'Pending', invitation_token: 'test-token-123', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];
let payments = [];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ENDPOINTS ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = admins.find(a => a.email === email);
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.json({ 
      token, 
      admin: { id: admin.id, name: admin.name, email: admin.email } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const admin = admins.find(a => a.id === userId);
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ admin: { id: admin.id, name: admin.name, email: admin.email, phone: admin.phone } });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ==================== STATUS ENDPOINT ====================
app.get('/api/status', async (req, res) => {
  res.json({
    message: 'Backend successfully connected to Frontend!',
    databaseStatus: 'Using in-memory database (fallback)',
    dummyData: { client_name: 'Kavleri', event_name: 'Dream Syariah Wedding - Gold Package', status: 'Confirmed' }
  });
});

// ==================== PACKAGES ENDPOINTS ====================
app.get('/api/packages', async (req, res) => {
  res.json(packages);
});

app.get('/api/packages/:id', async (req, res) => {
  const pkg = packages.find(p => p.id === parseInt(req.params.id));
  if (!pkg) {
    return res.status(404).json({ message: 'Package not found' });
  }
  res.json(pkg);
});

app.post('/api/packages', authenticateToken, async (req, res) => {
  const newPackage = {
    id: packages.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  packages.push(newPackage);
  res.status(201).json(newPackage);
});

app.put('/api/packages/:id', authenticateToken, async (req, res) => {
  const index = packages.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Package not found' });
  }
  packages[index] = { ...packages[index], ...req.body, updated_at: new Date().toISOString() };
  res.json(packages[index]);
});

app.delete('/api/packages/:id', authenticateToken, async (req, res) => {
  const index = packages.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Package not found' });
  }
  packages.splice(index, 1);
  res.json({ message: 'Package deleted successfully' });
});

// ==================== PORTFOLIO ENDPOINTS ====================
app.get('/api/portfolio', async (req, res) => {
  res.json(portfolio);
});

// ==================== VENDORS ENDPOINTS ====================
app.get('/api/vendors', async (req, res) => {
  res.json(vendors);
});

// ==================== CLIENTS ENDPOINTS ====================
app.get('/api/clients', authenticateToken, async (req, res) => {
  res.json({ clients });
});

app.post('/api/clients', authenticateToken, async (req, res) => {
  const newClient = {
    id: clients.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  clients.push(newClient);
  res.status(201).json({ client: newClient });
});

app.put('/api/clients/:id', authenticateToken, async (req, res) => {
  const index = clients.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Client not found' });
  }
  clients[index] = { ...clients[index], ...req.body, updated_at: new Date().toISOString() };
  res.json({ client: clients[index] });
});

app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
  const index = clients.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Client not found' });
  }
  clients.splice(index, 1);
  res.json({ message: 'Client deleted successfully' });
});

// ==================== EVENTS ENDPOINTS ====================
app.get('/api/events', authenticateToken, async (req, res) => {
  const eventsWithClient = events.map(e => {
    const client = clients.find(c => c.id === e.client_id);
    return { ...e, client_name: client?.name || 'Unknown' };
  });
  res.json({ events: eventsWithClient });
});

app.get('/api/events/calendar', authenticateToken, async (req, res) => {
  res.json({ bookedDates: events.map(e => e.event_date) });
});

app.post('/api/events', authenticateToken, async (req, res) => {
  const newEvent = {
    id: events.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  events.push(newEvent);
  const client = clients.find(c => c.id === newEvent.client_id);
  res.status(201).json({ event: { ...newEvent, client_name: client?.name || 'Unknown' } });
});

app.put('/api/events/:id', authenticateToken, async (req, res) => {
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  events[index] = { ...events[index], ...req.body, updated_at: new Date().toISOString() };
  const client = clients.find(c => c.id === events[index].client_id);
  res.json({ event: { ...events[index], client_name: client?.name || 'Unknown' } });
});

app.delete('/api/events/:id', authenticateToken, async (req, res) => {
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Event not found' });
  }
  events.splice(index, 1);
  res.json({ message: 'Event deleted successfully' });
});

// ==================== BOOKINGS ENDPOINTS ====================
app.get('/api/bookings', authenticateToken, async (req, res) => {
  const bookingsWithDetails = bookings.map(b => {
    const client = clients.find(c => c.id === b.client_id);
    const pkg = packages.find(p => p.id === b.package_id);
    const event = events.find(e => e.id === b.event_id);
    return { 
      ...b, 
      client_name: client?.name || 'Unknown', 
      package_name: pkg?.name || 'Unknown',
      groom_name: event?.groom_name || 'Unknown',
      bride_name: event?.bride_name || 'Unknown',
      event_date: event?.event_date || 'Unknown'
    };
  });
  res.json({ bookings: bookingsWithDetails });
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  const newBooking = {
    id: bookings.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  bookings.push(newBooking);
  const client = clients.find(c => c.id === newBooking.client_id);
  const pkg = packages.find(p => p.id === newBooking.package_id);
  const event = events.find(e => e.id === newBooking.event_id);
  res.status(201).json({ 
    booking: { 
      ...newBooking, 
      client_name: client?.name || 'Unknown', 
      package_name: pkg?.name || 'Unknown',
      groom_name: event?.groom_name || 'Unknown',
      bride_name: event?.bride_name || 'Unknown',
      event_date: event?.event_date || 'Unknown'
    } 
  });
});

app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  bookings[index] = { ...bookings[index], ...req.body, updated_at: new Date().toISOString() };
  const client = clients.find(c => c.id === bookings[index].client_id);
  const pkg = packages.find(p => p.id === bookings[index].package_id);
  const event = events.find(e => e.id === bookings[index].event_id);
  res.json({ 
    booking: { 
      ...bookings[index], 
      client_name: client?.name || 'Unknown', 
      package_name: pkg?.name || 'Unknown',
      groom_name: event?.groom_name || 'Unknown',
      bride_name: event?.bride_name || 'Unknown',
      event_date: event?.event_date || 'Unknown'
    } 
  });
});

app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  bookings.splice(index, 1);
  res.json({ message: 'Booking deleted successfully' });
});

// ==================== PAYMENTS ENDPOINTS ====================
app.get('/api/payments', authenticateToken, async (req, res) => {
  const paymentsWithDetails = payments.map(p => {
    const booking = bookings.find(b => b.id === p.booking_id);
    const client = booking ? clients.find(c => c.id === booking.client_id) : null;
    return { 
      ...p, 
      booking_id: p.booking_id,
      client_name: client?.name || 'Unknown'
    };
  });
  res.json({ payments: paymentsWithDetails });
});

app.post('/api/payments', authenticateToken, async (req, res) => {
  const newPayment = {
    id: payments.length + 1,
    ...req.body,
    invoice_number: `INV-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  payments.push(newPayment);
  const booking = bookings.find(b => b.id === newPayment.booking_id);
  const client = booking ? clients.find(c => c.id === booking.client_id) : null;
  res.status(201).json({ 
    payment: { 
      ...newPayment, 
      client_name: client?.name || 'Unknown'
    } 
  });
});

app.put('/api/payments/:id', authenticateToken, async (req, res) => {
  const index = payments.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  payments[index] = { ...payments[index], ...req.body, updated_at: new Date().toISOString() };
  const booking = bookings.find(b => b.id === payments[index].booking_id);
  const client = booking ? clients.find(c => c.id === booking.client_id) : null;
  res.json({ 
    payment: { 
      ...payments[index], 
      client_name: client?.name || 'Unknown'
    } 
  });
});

app.delete('/api/payments/:id', authenticateToken, async (req, res) => {
  const index = payments.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Payment not found' });
  }
  payments.splice(index, 1);
  res.json({ message: 'Payment deleted successfully' });
});

// ==================== GUESTS ENDPOINTS ====================
app.get('/api/events/:eventId/guests', authenticateToken, async (req, res) => {
  const eventGuests = guests.filter(g => g.event_id === parseInt(req.params.eventId));
  res.json({ guests: eventGuests });
});

app.get('/api/guests', authenticateToken, async (req, res) => {
  const guestsWithEvent = guests.map(g => {
    const event = events.find(e => e.id === g.event_id);
    return { 
      ...g, 
      groom_name: event?.groom_name || 'Unknown',
      bride_name: event?.bride_name || 'Unknown'
    };
  });
  res.json({ guests: guestsWithEvent });
});

app.post('/api/guests', authenticateToken, async (req, res) => {
  const newGuest = {
    id: guests.length + 1,
    ...req.body,
    invitation_token: crypto.randomBytes(32).toString('hex'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  guests.push(newGuest);
  const event = events.find(e => e.id === newGuest.event_id);
  res.status(201).json({ 
    guest: { 
      ...newGuest, 
      groom_name: event?.groom_name || 'Unknown',
      bride_name: event?.bride_name || 'Unknown'
    } 
  });
});

app.put('/api/guests/:id', authenticateToken, async (req, res) => {
  const index = guests.findIndex(g => g.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Guest not found' });
  }
  guests[index] = { ...guests[index], ...req.body, updated_at: new Date().toISOString() };
  const event = events.find(e => e.id === guests[index].event_id);
  res.json({ 
    guest: { 
      ...guests[index], 
      groom_name: event?.groom_name || 'Unknown',
      bride_name: event?.bride_name || 'Unknown'
    } 
  });
});

app.delete('/api/guests/:id', authenticateToken, async (req, res) => {
  const index = guests.findIndex(g => g.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Guest not found' });
  }
  guests.splice(index, 1);
  res.json({ message: 'Guest deleted successfully' });
});

// ==================== PUBLIC GUEST RSVP ENDPOINT ====================
app.get('/api/guests/token/:token', async (req, res) => {
  const guest = guests.find(g => g.invitation_token === req.params.token);
  if (!guest) {
    return res.status(404).json({ message: 'Invitation not found' });
  }
  const event = events.find(e => e.id === guest.event_id);
  res.json({ guest, event });
});

app.put('/api/guests/token/:token/rsvp', async (req, res) => {
  const index = guests.findIndex(g => g.invitation_token === req.params.token);
  if (index === -1) {
    return res.status(404).json({ message: 'Invitation not found' });
  }
  guests[index] = { ...guests[index], status: req.body.status, updated_at: new Date().toISOString() };
  res.json({ guest: guests[index] });
});

app.listen(port, () => {
  console.log(`🚀 Yuhu! Backend running smoothly at http://localhost:${port}`);
});
