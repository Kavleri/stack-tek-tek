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

// ==================== DATABASE CONFIG CONTROL ====================
// Ubah ke true untuk menggunakan database MySQL asli, 
// atau false untuk menggunakan data dummy in-memory.
const USE_DATABASE = process.env.USE_DATABASE === 'true' || false; 
// =================================================================

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

if (USE_DATABASE) {
  // ==================== REAL DATABASE INTEGRATION ====================
  console.log('📡 Berjalan dalam mode DATABASE (MySQL)');
  require('../config/database');
  
  // Import Routes
  const adminRoutes = require('../routes/adminRoutes');
  const weddingPackageRoutes = require('../routes/weddingPackageRoutes');
  const eventRoutes = require('../routes/event');
  const guestRoutes = require('../routes/guestRoutes');
  const paymentRoutes = require('../routes/paymentRoutes');
  const installmentRoutes = require('../routes/installmentRoutes');

  // Gunakan Routes
  app.use('/api/admins', adminRoutes);
  app.use('/api/packages', weddingPackageRoutes);
  app.use('/api/events', eventRoutes); // Note: event.js might have /booking, /bookings etc.
  app.use('/api/guests', guestRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/installments', installmentRoutes);
  
  // Auth compatibility layer (adminRoutes handles login)
  app.use('/api/auth', adminRoutes); 

} else {
  // ==================== DUMMY DATA INTEGRATION ====================
  console.log('⚠️ Berjalan dalam mode DUMMY (In-Memory)');
  
  // Dataset dummy dipindahkan ke datadummmy.js
  let { admins, packages, events, payments, guests } = require('./datadummmy');

  // Helper functions
  const slugify = (text) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  let installmentPayments = [];

  const mapPaymentForFrontend = (payment) => {
    const event = events.find((e) => e.id === payment.event_id);
    const pkg = event ? packages.find((p) => p.id === event.package_id) : null;
    const normalizedType = payment.payment_type === 'final_payment'
      ? 'Full Payment'
      : payment.payment_type === 'down_payment'
        ? 'Down Payment'
        : 'Installment';

    const normalizedStatus = payment.payment_type === 'final_payment' ? 'Completed' : 'Pending';

    return {
      ...payment,
      amount: Number(payment.payment_amount),
      booking_id: event ? event.id : payment.event_id,
      payment_method: payment.payment_method || 'Transfer',
      payment_type: normalizedType,
      status: normalizedStatus,
      invoice_number: event ? event.invoice_number : 'N/A',
      notes: payment.receipt_note || '',
      client_name: event ? event.client_name : 'Unknown',
      client_phone: event ? event.client_phone : '',
      groom_name: event ? event.client_name : '',
      bride_name: '',
      event_date: event ? event.event_date : '',
      package_price: pkg ? pkg.price : 0
    };
  };

  const buildInstallmentPlans = () => {
    return events
      .filter((event) => event.package_id)
      .map((event) => {
        const pkg = packages.find((p) => p.id === event.package_id);
        const totalInstallments = pkg?.price >= 50000000 ? 4 : pkg?.price >= 30000000 ? 3 : 2;
        const installmentAmount = Math.ceil((pkg?.price || 0) / totalInstallments / 1000) * 1000;
        const paidInstallments = installmentPayments.filter((record) => record.event_id === event.id).length;
        const nextDueDate = new Date(event.event_date);
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isOverdue = nextDueDate < today && paidInstallments < totalInstallments;

        return {
          id: event.id,
          booking_id: event.id,
          total_installments: totalInstallments,
          installment_amount: installmentAmount,
          paid_installments: Math.min(paidInstallments, totalInstallments),
          next_due_date: nextDueDate.toISOString().split('T')[0],
          status: paidInstallments >= totalInstallments ? 'Completed' : isOverdue ? 'Overdue' : 'Active',
          notes: '',
          client_name: event.client_name,
          client_phone: event.client_phone,
          groom_name: event.client_name,
          bride_name: '',
          event_date: event.event_date,
          booking_total: pkg?.price || 0
        };
      });
  };

  const buildInstallmentSchedules = (planId) => {
    const plan = buildInstallmentPlans().find((item) => item.id === planId);
    if (!plan) return [];

    const event = events.find((item) => item.id === plan.booking_id);
    const schedules = [];

    for (let index = 1; index <= plan.total_installments; index += 1) {
      const dueDate = new Date(event?.event_date || new Date());
      dueDate.setDate(dueDate.getDate() + index * 7);
      const scheduleId = Number(`${plan.id}${String(index).padStart(2, '0')}`);
      const paymentRecord = installmentPayments.find((record) => record.schedule_id === scheduleId);
      const paidAmount = paymentRecord ? plan.installment_amount : 0;
      const isPaid = Boolean(paymentRecord);

      schedules.push({
        id: scheduleId,
        installment_plan_id: plan.id,
        installment_number: index,
        due_date: dueDate.toISOString().split('T')[0],
        amount: plan.installment_amount,
        paid_amount: paidAmount,
        status: isPaid ? 'Paid' : 'Pending',
        payment_date: paymentRecord?.payment_date || '',
        notes: paymentRecord?.notes || ''
      });
    }

    return schedules;
  };

  // Middleware: Authenticate Token (Dummy version)
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

  // --- Dummy Endpoints Implementation ---
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = admins.find(a => a.username === username);
      
      if (!admin) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role, fullName: admin.full_name },
        JWT_SECRET,
        { expiresIn: '12h' }
      );

      res.json({ 
        token, 
        admin: { id: admin.id, username: admin.username, full_name: admin.full_name, role: admin.role } 
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

      res.json({ admin: { id: admin.id, username: admin.username, full_name: admin.full_name, role: admin.role } });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // ==================== ADMIN ACCOUNTS ENDPOINTS ====================

  app.get('/api/admins', authenticateToken, async (req, res) => {
    const safeAdmins = admins.map(({ password, ...a }) => a);
    res.json(safeAdmins);
  });

  app.post('/api/admins', authenticateToken, async (req, res) => {
    try {
      const { username, password, full_name, role } = req.body;

      if (!username || !password || !full_name) {
        return res.status(400).json({ message: 'Username, password, and full name are required' });
      }

      if (admins.some(a => a.username === username)) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = {
        id: admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1,
        username,
        password: hashedPassword,
        full_name,
        role: role || 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      admins.push(newAdmin);
      const { password: _, ...safeAdmin } = newAdmin;
      res.status(201).json(safeAdmin);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create admin account' });
    }
  });

  app.put('/api/admins/:id', authenticateToken, async (req, res) => {
    const index = admins.findIndex(a => a.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const { full_name, role } = req.body;
    admins[index] = {
      ...admins[index],
      full_name: full_name || admins[index].full_name,
      role: role || admins[index].role,
      updated_at: new Date().toISOString()
    };

    const { password: _, ...safeAdmin } = admins[index];
    res.json(safeAdmin);
  });

  app.put('/api/admins/:id/reset-password', authenticateToken, async (req, res) => {
    try {
      const index = admins.findIndex(a => a.id === parseInt(req.params.id));
      if (index === -1) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      const { newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).json({ message: 'New password is required' });
      }

      admins[index].password = await bcrypt.hash(newPassword, 10);
      admins[index].updated_at = new Date().toISOString();
      res.json({ message: 'Password successfully reset' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to reset password' });
    }
  });

  app.delete('/api/admins/:id', authenticateToken, async (req, res) => {
    const idToDelete = parseInt(req.params.id);
    if (req.user.id === idToDelete) {
      return res.status(400).json({ message: 'Self-deletion is prohibited' });
    }

    const index = admins.findIndex(a => a.id === idToDelete);
    if (index === -1) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admins.splice(index, 1);
    res.json({ message: 'Admin account successfully deleted' });
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
    const { package_name, price, description, is_active } = req.body;
    if (!package_name || price === undefined) {
      return res.status(400).json({ message: 'Package name and price are required' });
    }

    const newPackage = {
      id: packages.length > 0 ? Math.max(...packages.map(p => p.id)) + 1 : 1,
      package_name,
      price: Number(price),
      description: description || '',
      is_active: is_active !== undefined ? !!is_active : true,
      created_at: new Date().toISOString()
    };

    packages.push(newPackage);
    res.status(201).json(newPackage);
  });

  app.put('/api/packages/:id', authenticateToken, async (req, res) => {
    const index = packages.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const { package_name, price, description, is_active } = req.body;
    packages[index] = {
      ...packages[index],
      package_name: package_name || packages[index].package_name,
      price: price !== undefined ? Number(price) : packages[index].price,
      description: description !== undefined ? description : packages[index].description,
      is_active: is_active !== undefined ? !!is_active : packages[index].is_active
    };

    res.json(packages[index]);
  });

  app.delete('/api/packages/:id', authenticateToken, async (req, res) => {
    const index = packages.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Package not found' });
    }
    packages.splice(index, 1);
    res.json({ message: 'Package successfully deleted' });
  });

  // ==================== EVENTS ENDPOINTS ====================

  app.get('/api/events', authenticateToken, async (req, res) => {
    const eventsWithPackage = events.map(e => {
      const pkg = packages.find(p => p.id === e.package_id);
      return { 
        ...e, 
        package_name: pkg ? pkg.package_name : 'N/A',
        package_price: pkg ? pkg.price : 0
      };
    });
    res.json({ data: eventsWithPackage, events: eventsWithPackage });
  });

  app.get('/api/events/calendar', authenticateToken, async (req, res) => {
    // Only return confirmed date events
    const bookedDates = events
      .filter(e => e.status === 'confirmed')
      .map(e => e.event_date);
    res.json({ bookedDates });
  });

  app.post('/api/events', authenticateToken, async (req, res) => {
    const { 
      client_name, client_phone, event_date, event_time, 
      location_name, location_address, google_maps_link, 
      package_id, status, notes_for_field_staff 
    } = req.body;

    if (!client_name || !client_phone || !event_date || !event_time || !location_name) {
      return res.status(400).json({ message: 'Missing required event fields' });
    }

    // 1. Double Booking check
    if (status === 'confirmed') {
      const doubleBooking = events.find(e => e.event_date === event_date && e.status === 'confirmed');
      if (doubleBooking) {
        return res.status(400).json({ message: `Tanggal ${event_date} sudah terisi oleh acara lain yang berstatus 'confirmed' (Double Booking)` });
      }
    }

    // 2. Generate Invoice Number INV/YYYYMMDD/XXXX
    const dateStr = event_date.replace(/-/g, ''); // YYYYMMDD
    const dailyEvents = events.filter(e => e.invoice_number && e.invoice_number.startsWith(`INV/${dateStr}`));
    const nextSeq = String(dailyEvents.length + 1).padStart(4, '0');
    const invoice_number = `INV/${dateStr}/${nextSeq}`;

    const newEvent = {
      id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
      invoice_number,
      client_name,
      client_phone,
      event_date,
      event_time,
      location_name,
      location_address: location_address || '',
      google_maps_link: google_maps_link || '',
      package_id: package_id ? Number(package_id) : null,
      status: status || 'pending',
      notes_for_field_staff: notes_for_field_staff || '',
      created_at: new Date().toISOString()
    };

    events.push(newEvent);
    const pkg = packages.find(p => p.id === newEvent.package_id);
    res.status(201).json({ 
      event: { 
        ...newEvent, 
        package_name: pkg ? pkg.package_name : 'N/A',
        package_price: pkg ? pkg.price : 0
      } 
    });
  });

  app.put('/api/events/:id', authenticateToken, async (req, res) => {
    const index = events.findIndex(e => e.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { 
      client_name, client_phone, event_date, event_time, 
      location_name, location_address, google_maps_link, 
      package_id, status, notes_for_field_staff 
    } = req.body;

    // 1. Double Booking check
    if (status === 'confirmed') {
      const doubleBooking = events.find(e => 
        e.id !== parseInt(req.params.id) && 
        e.event_date === (event_date || events[index].event_date) && 
        e.status === 'confirmed'
      );
      if (doubleBooking) {
        return res.status(400).json({ message: `Tanggal ${event_date || events[index].event_date} sudah terisi oleh acara lain yang berstatus 'confirmed' (Double Booking)` });
      }
    }

    events[index] = {
      ...events[index],
      client_name: client_name || events[index].client_name,
      client_phone: client_phone || events[index].client_phone,
      event_date: event_date || events[index].event_date,
      event_time: event_time || events[index].event_time,
      location_name: location_name || events[index].location_name,
      location_address: location_address !== undefined ? location_address : events[index].location_address,
      google_maps_link: google_maps_link !== undefined ? google_maps_link : events[index].google_maps_link,
      package_id: package_id !== undefined ? (package_id ? Number(package_id) : null) : events[index].package_id,
      status: status || events[index].status,
      notes_for_field_staff: notes_for_field_staff !== undefined ? notes_for_field_staff : events[index].notes_for_field_staff
    };

    const pkg = packages.find(p => p.id === events[index].package_id);
    res.json({ 
      event: { 
        ...events[index], 
        package_name: pkg ? pkg.package_name : 'N/A',
        package_price: pkg ? pkg.price : 0
      } 
    });
  });

  app.delete('/api/events/:id', authenticateToken, async (req, res) => {
    const index = events.findIndex(e => e.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Cascade delete payments and guests
    const eventId = events[index].id;
    payments = payments.filter(p => p.event_id !== eventId);
    guests = guests.filter(g => g.event_id !== eventId);

    events.splice(index, 1);
    res.json({ message: 'Event and related records successfully deleted' });
  });

  // ==================== PAYMENTS ENDPOINTS ====================

  app.get('/api/payments', authenticateToken, async (req, res) => {
    const paymentsWithDetails = payments.map(mapPaymentForFrontend);
    res.json({ data: paymentsWithDetails, payments: paymentsWithDetails });
  });

  app.post('/api/payments', authenticateToken, async (req, res) => {
    const { event_id, payment_amount, payment_date, payment_type, payment_method, receipt_note } = req.body;

    if (!event_id || payment_amount === undefined || !payment_date || !payment_type) {
      return res.status(400).json({ message: 'Missing required payment fields' });
    }

    const eventExists = events.some(e => e.id === Number(event_id));
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newPayment = {
      id: payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1,
      event_id: Number(event_id),
      payment_amount: Number(payment_amount),
      payment_date,
      payment_type,
      payment_method: payment_method || '',
      receipt_note: receipt_note || '',
      created_at: new Date().toISOString()
    };

    payments.push(newPayment);
    res.status(201).json({
      payment: mapPaymentForFrontend(newPayment)
    });
  });

  app.put('/api/payments/:id', authenticateToken, async (req, res) => {
    const index = payments.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const { payment_amount, payment_date, payment_type, payment_method, receipt_note } = req.body;

    payments[index] = {
      ...payments[index],
      payment_amount: payment_amount !== undefined ? Number(payment_amount) : payments[index].payment_amount,
      payment_date: payment_date || payments[index].payment_date,
      payment_type: payment_type || payments[index].payment_type,
      payment_method: payment_method !== undefined ? payment_method : payments[index].payment_method,
      receipt_note: receipt_note !== undefined ? receipt_note : payments[index].receipt_note
    };

    const event = events.find(e => e.id === payments[index].event_id);
    const pkg = event ? packages.find(pk => pk.id === event.package_id) : null;

    res.json({ 
      payment: { 
        ...payments[index], 
        client_name: event ? event.client_name : 'Unknown',
        invoice_number: event ? event.invoice_number : 'N/A',
        package_price: pkg ? pkg.price : 0
      } 
    });
  });

  app.delete('/api/payments/:id', authenticateToken, async (req, res) => {
    const index = payments.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    payments.splice(index, 1);
    res.json({ message: 'Payment successfully deleted' });
  });

  // ==================== GUESTS ENDPOINTS ====================

  app.get('/api/events/:eventId/guests', authenticateToken, async (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const eventGuests = guests.filter(g => g.event_id === eventId);
    res.json({ guests: eventGuests });
  });

  app.get('/api/guests', authenticateToken, async (req, res) => {
    const guestsWithEvent = guests.map(g => {
      const event = events.find(e => e.id === g.event_id);
      return { 
        ...g, 
        client_name: event ? event.client_name : 'N/A',
        event_date: event ? event.event_date : 'N/A',
        invoice_number: event ? event.invoice_number : 'N/A'
      };
    });
    res.json({ guests: guestsWithEvent });
  });

  app.post('/api/guests', authenticateToken, async (req, res) => {
    const { event_id, guest_name, guest_phone, invitation_slug, is_attended } = req.body;

    if (!event_id || !guest_name) {
      return res.status(400).json({ message: 'Event ID and Guest Name are required' });
    }

    const generatedSlug = invitation_slug || `${slugify(guest_name)}-${Math.random().toString(36).substring(2, 6)}`;

    const newGuest = {
      id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
      event_id: Number(event_id),
      guest_name,
      guest_phone: guest_phone || '',
      invitation_slug: generatedSlug,
      is_attended: is_attended !== undefined ? !!is_attended : false,
      created_at: new Date().toISOString()
    };

    guests.push(newGuest);
    const event = events.find(e => e.id === newGuest.event_id);
    res.status(201).json({ 
      guest: { 
        ...newGuest, 
        client_name: event ? event.client_name : 'N/A',
        event_date: event ? event.event_date : 'N/A',
        invoice_number: event ? event.invoice_number : 'N/A'
      } 
    });
  });

  app.put('/api/guests/:id', authenticateToken, async (req, res) => {
    const index = guests.findIndex(g => g.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    const { guest_name, guest_phone, invitation_slug, is_attended } = req.body;

    guests[index] = {
      ...guests[index],
      guest_name: guest_name || guests[index].guest_name,
      guest_phone: guest_phone !== undefined ? guest_phone : guests[index].guest_phone,
      invitation_slug: invitation_slug || guests[index].invitation_slug,
      is_attended: is_attended !== undefined ? !!is_attended : guests[index].is_attended
    };

    const event = events.find(e => e.id === guests[index].event_id);
    res.json({ 
      guest: { 
        ...guests[index], 
        client_name: event ? event.client_name : 'N/A',
        event_date: event ? event.event_date : 'N/A',
        invoice_number: event ? event.invoice_number : 'N/A'
      } 
    });
  });

  app.delete('/api/guests/:id', authenticateToken, async (req, res) => {
    const index = guests.findIndex(g => g.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    guests.splice(index, 1);
    res.json({ message: 'Guest successfully deleted' });
  });

  // ==================== PUBLIC GUEST RSVP ENDPOINTS ====================

  app.get('/api/guests/token/:token', async (req, res) => {
    const guest = guests.find(g => g.invitation_slug === req.params.token);
    if (!guest) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    const event = events.find(e => e.id === guest.event_id);
    res.json({ guest, event });
  });

  app.put('/api/guests/token/:token/rsvp', async (req, res) => {
    const index = guests.findIndex(g => g.invitation_slug === req.params.token);
    if (index === -1) {
      return res.status(404).json({ message: 'Invitation not found' });
    }
    
    const { status } = req.body;
    guests[index].is_attended = status === 'Attending';
    
    res.json({ guest: guests[index] });
  });

  // ==================== INSTALLMENTS ENDPOINTS (DUMMY) ====================

  app.get('/api/installments', authenticateToken, async (req, res) => {
    const plans = buildInstallmentPlans();
    res.json({ data: plans, installments: plans });
  });

  app.get('/api/installments/summary/dashboard', authenticateToken, async (req, res) => {
    const plans = buildInstallmentPlans();
    const summary = {
      total_plans: plans.length,
      active_plans: plans.filter((plan) => plan.status === 'Active').length,
      overdue_plans: plans.filter((plan) => plan.status === 'Overdue').length,
      completed_plans: plans.filter((plan) => plan.status === 'Completed').length,
      total_value: plans.reduce((sum, plan) => sum + plan.booking_total, 0),
      total_paid: plans.reduce((sum, plan) => sum + (plan.installment_amount * plan.paid_installments), 0)
    };

    res.json({ data: summary });
  });

  app.get('/api/installments/:id', authenticateToken, async (req, res) => {
    const planId = Number(req.params.id);
    const schedules = buildInstallmentSchedules(planId);
    res.json({ data: { plan_id: planId, schedules } });
  });

  app.post('/api/installments/:scheduleId/payment', authenticateToken, async (req, res) => {
    const scheduleId = Number(req.params.scheduleId);
    const { amount, payment_date, status, notes } = req.body;

    const existingRecord = installmentPayments.find((record) => record.schedule_id === scheduleId);
    const paymentPayload = {
      schedule_id: scheduleId,
      event_id: Number(String(scheduleId).slice(0, -2)) || 0,
      amount: Number(amount) || 0,
      payment_date: payment_date || new Date().toISOString().split('T')[0],
      status: status || 'Paid',
      notes: notes || '',
      created_at: new Date().toISOString()
    };

    if (existingRecord) {
      Object.assign(existingRecord, paymentPayload);
    } else {
      installmentPayments.push(paymentPayload);
    }

    res.json({ data: { success: true, schedule_id: scheduleId } });
  });
}

// ==================== COMMON ENDPOINTS (PORTFOLIO & STATUS) ====================

app.get('/api/portfolio', async (req, res) => {
  res.json([
    { id: 1, title: 'Al-Husna Grand Wedding', category: 'The Royal Ballroom', image_path: '/images/portfolio-ballroom.jpg' },
    { id: 2, title: 'Culinary Excellence', category: 'Halal Catering', image_path: '/images/portfolio-catering.jpg' },
    { id: 3, title: 'Outdoor Serenity', category: 'Garden Wedding', image_path: '/images/portfolio-outdoor.jpg' }
  ]);
});

app.get('/api/vendors', async (req, res) => {
  res.json([
    { id: 1, name: 'Luxe Halal Catering', category: 'Catering', icon: 'restaurant' },
    { id: 2, name: 'Bloom Syariah Floral', category: 'Floral', icon: 'local_florist' },
    { id: 3, name: 'Modest Moments Studio', category: 'Documentation', icon: 'camera_enhance' },
    { id: 4, name: 'Elegance Bridal Wear', category: 'Attire', icon: 'styler' }
  ]);
});

app.get('/api/status', async (req, res) => {
  res.json({
    message: 'Backend successfully connected to Frontend!',
    databaseStatus: USE_DATABASE ? 'Live MySQL Database' : 'Using database.sql aligned in-memory DB (Dummy Mode)',
    mode: USE_DATABASE ? 'REAL_DB' : 'DUMMY',
    dummyData: USE_DATABASE ? null : { client_name: 'Kavleri', event_name: 'Silver Package Wedding', status: 'confirmed' }
  });
});

app.listen(port, () => {
  console.log(`🚀 Yuhu! Backend running smoothly at http://localhost:${port}`);
  console.log(`🛠️  Mode: ${USE_DATABASE ? 'REAL DATABASE (MySQL)' : 'DUMMY (IN-MEMORY)'}`);
});

