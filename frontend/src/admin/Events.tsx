import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Package {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface Event {
  id: number;
  client_name?: string;
  client_phone?: string;
  groom_name?: string;
  bride_name?: string;
  event_date: string;
  location: string;
  theme?: string;
  status: string;
  package_id: number;
  package_name?: string;
  package_price?: number;
  created_at?: string;
}

interface FormData {
  client_name: string;
  client_phone: string;
  client_email?: string;
  client_address?: string;
  groom_name: string;
  bride_name: string;
  event_date: string;
  event_time?: string;
  location: string;
  theme?: string;
  package_id: string;
  status: string;
  notes?: string;
}

interface BookedDate {
  date: string;
  eventId: number;
}

export default function Events() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [formData, setFormData] = useState<FormData>({
    client_name: '',
    client_phone: '',
    client_email: '',
    client_address: '',
    groom_name: '',
    bride_name: '',
    event_date: '',
    event_time: '',
    location: '',
    theme: '',
    package_id: '',
    status: 'Pending',
    notes: '',
  });

  // Normalize API response to ensure `events` is always an array
  const normalizeEvents = (data: any): Event[] => {
    if (Array.isArray(data)) return data as Event[];
    if (data && Array.isArray(data.data)) return data.data as Event[];
    return [];
  };

  // Fetch packages and events
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packagesRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}/api/packages`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/events`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (packagesRes.ok) {
          const packagesData = await packagesRes.json();
          setPackages(packagesData.data || packagesData);
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(normalizeEvents(eventsData));
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!formData.client_name || !formData.groom_name || !formData.bride_name || !formData.event_date || !formData.location || !formData.package_id) {
        setError('Please fill in all required fields');
        return;
      }

      const method = editingId ? 'PUT' : 'POST';
      const endpoint = editingId ? `${API_URL}/api/events/${editingId}` : `${API_URL}/api/events`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save event');
      }

      setSuccess(editingId ? 'Event updated successfully!' : 'Event created successfully!');
      setFormData({
        client_name: '',
        client_phone: '',
        client_email: '',
        client_address: '',
        groom_name: '',
        bride_name: '',
        event_date: '',
        event_time: '',
        location: '',
        theme: '',
        package_id: '',
        status: 'Pending',
        notes: '',
      });
      setShowForm(false);
      setEditingId(null);

      // Refresh events
      const eventsRes = await fetch(`${API_URL}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(normalizeEvents(eventsData));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    }
  };

  const handleEdit = (event: Event) => {
    setFormData({
      client_name: event.client_name || '',
      client_phone: event.client_phone || '',
      client_email: '',
      client_address: '',
      groom_name: event.groom_name || '',
      bride_name: event.bride_name || '',
      event_date: event.event_date,
      event_time: '',
      location: event.location,
      theme: event.theme || '',
      package_id: event.package_id.toString(),
      status: event.status,
      notes: '',
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete event');

      setSuccess('Event deleted successfully!');
      setEvents(prev => (Array.isArray(prev) ? prev.filter(e => e.id !== eventId) : []));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  // Get booked dates for current month
  const getBookedDates = (): BookedDate[] => {
    return events
      .filter(e => e.status === 'Confirmed')
      .map(e => ({
        date: e.event_date,
        eventId: e.id,
      }));
  };

  // Calendar generation
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const bookedDates = getBookedDates();

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isBooked = bookedDates.some(bd => bd.date === dateStr);
      days.push({ day, dateStr, isBooked });
    }

    return days;
  };

  // Filter events based on search and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.groom_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.bride_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Header Section */}
        <div className="p-8 bg-gradient-to-br from-primary to-primary-container text-white">
          <div className="mb-4">
            <p className="text-secondary text-[10px] uppercase tracking-widest font-semibold">Manajemen Acara</p>
          </div>
          <h1 className="text-5xl font-serif font-bold leading-tight mb-2">Events & Scheduling</h1>
          <p className="text-white/70 font-sans text-base max-w-2xl">
            Kelola pemesanan acara pernikahan, validasi tanggal otomatis, dan cegah double booking
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8 max-w-7xl">
          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 px-6 py-4 bg-secondary-container text-on-secondary-container rounded-xl font-sans flex items-center gap-3 shadow-ambient">
              <span className="material-symbols-outlined">check_circle</span>
              {success}
            </div>
          )}
          {error && (
            <div className="mb-6 px-6 py-4 bg-error-container text-on-error rounded-xl font-sans flex items-center gap-3 shadow-ambient">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left: Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient-sm">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">{monthName}</h2>
                
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="px-4 py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <p className="font-sans text-on-surface-variant text-sm">{monthName}</p>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="px-4 py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-sans font-semibold text-xs uppercase tracking-wider text-on-surface-variant py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((dayObj, idx) => (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center rounded-lg font-sans text-sm font-semibold transition-all ${
                        dayObj === null
                          ? ''
                          : dayObj.isBooked
                          ? 'bg-secondary text-on-secondary shadow-ambient-sm'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high cursor-pointer'
                      }`}
                    >
                      {dayObj?.day}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-outline-variant/20 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary rounded"></div>
                    <p className="text-xs font-sans text-on-surface-variant">Booked (Confirmed)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-surface-container rounded"></div>
                    <p className="text-xs font-sans text-on-surface-variant">Available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Create Event Button & Quick Stats */}
            <div className="flex flex-col gap-6">
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  setFormData({
                    client_name: '',
                    client_phone: '',
                    client_email: '',
                    client_address: '',
                    groom_name: '',
                    bride_name: '',
                    event_date: '',
                    event_time: '',
                    location: '',
                    theme: '',
                    package_id: '',
                    status: 'Pending',
                    notes: '',
                  });
                }}
                className="px-6 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-sans font-semibold shadow-ambient transition-all hover:shadow-ambient-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add_circle</span>
                {showForm ? 'Cancel' : 'New Event'}
              </button>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <p className="text-xs font-sans uppercase tracking-wider text-on-surface-variant mb-1">Total Events</p>
                  <p className="text-3xl font-serif text-primary font-bold">{events.length}</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <p className="text-xs font-sans uppercase tracking-wider text-on-surface-variant mb-1">Confirmed</p>
                  <p className="text-3xl font-serif text-secondary font-bold">{events.filter(e => e.status === 'Confirmed').length}</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <p className="text-xs font-sans uppercase tracking-wider text-on-surface-variant mb-1">Pending</p>
                  <p className="text-3xl font-serif text-primary font-bold">{events.filter(e => e.status === 'Pending').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Form */}
          {showForm && (
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient-md mb-8">
              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                {editingId ? 'Edit Event' : 'Create New Event'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Information */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-serif font-bold text-primary mb-4">Client Information</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Client Name *
                    </label>
                    <input
                      type="text"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="e.g., Ahmad Wijaya"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="client_phone"
                      value={formData.client_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="+62 812 3456 7890"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="client_email"
                      value={formData.client_email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="client@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="client_address"
                      value={formData.client_address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="Client's address"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="md:col-span-2 mt-6">
                    <h3 className="text-lg font-serif font-bold text-primary mb-4">Event Details</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Groom Name *
                    </label>
                    <input
                      type="text"
                      name="groom_name"
                      value={formData.groom_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="Groom's name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Bride Name *
                    </label>
                    <input
                      type="text"
                      name="bride_name"
                      value={formData.bride_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="Bride's name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Event Time
                    </label>
                    <input
                      type="time"
                      name="event_time"
                      value={formData.event_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="Event location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Theme
                    </label>
                    <input
                      type="text"
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      placeholder="e.g., Minimalis Modern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Package *
                    </label>
                    <select
                      name="package_id"
                      value={formData.package_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                      required
                    >
                      <option value="">Select a package</option>
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name} - Rp {pkg.price.toLocaleString('id-ID')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-sans font-semibold text-on-surface mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors resize-none"
                      rows={3}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-sans font-semibold shadow-ambient hover:shadow-ambient-md transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">save</span>
                    {editingId ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-6 py-3 bg-surface-container text-on-surface rounded-xl font-sans font-semibold hover:bg-surface-container-high transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Events List */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-ambient-sm">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">All Events</h2>

            {/* Search & Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Search by client name or couple names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-lg bg-surface border-b-2 border-outline-variant/20 focus:border-secondary focus:outline-none font-sans transition-colors"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Events Table */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-on-surface-variant font-sans">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-on-surface-variant font-sans mb-4">No events found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2 bg-secondary text-on-secondary rounded-lg font-sans font-semibold hover:bg-secondary/90 transition-all"
                >
                  Create First Event
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-variant/20">
                      <th className="text-left px-4 py-4 font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant">Client</th>
                      <th className="text-left px-4 py-4 font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant">Couple</th>
                      <th className="text-left px-4 py-4 font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant">Date</th>
                      <th className="text-left px-4 py-4 font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant">Location</th>
                      <th className="text-left px-4 py-4 font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant">Package</th>
                      <th className="text-left px-4 py-4 font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant">Status</th>
                      <th className="text-left px-4 py-4 font-sans font-bold text-sm uppercase tracking-wider text-on-surface-variant">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event, idx) => (
                      <tr 
                        key={event.id} 
                        className={`${idx % 2 === 0 ? 'bg-surface' : 'bg-surface-container-low'} hover:bg-surface-container-high transition-colors`}
                      >
                        <td className="px-4 py-4 font-sans text-sm text-on-surface">
                          <div>
                            <p className="font-semibold">{event.client_name}</p>
                            <p className="text-xs text-on-surface-variant">{event.client_phone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-sans text-sm text-on-surface">
                          <p className="font-semibold">{event.groom_name}</p>
                          <p className="text-xs text-on-surface-variant">{event.bride_name}</p>
                        </td>
                        <td className="px-4 py-4 font-sans text-sm text-on-surface">{event.event_date}</td>
                        <td className="px-4 py-4 font-sans text-sm text-on-surface">{event.location}</td>
                        <td className="px-4 py-4 font-sans text-sm">
                          <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-semibold">
                            {event.package_name || `Package ${event.package_id}`}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-sans text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              event.status === 'Confirmed'
                                ? 'bg-secondary text-on-secondary'
                                : event.status === 'Pending'
                                ? 'bg-outline-variant/20 text-on-surface'
                                : 'bg-error-container text-on-error'
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-sans text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(event)}
                              className="px-3 py-1 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-xs font-semibold flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="px-3 py-1 rounded-lg bg-error-container text-on-error hover:bg-error hover:text-white transition-colors text-xs font-semibold flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
