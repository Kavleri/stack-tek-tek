const db = require("../config/booking");

// generate invoice
function generateInvoice() {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth()+1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `INV/${y}${m}${d}/${rand}`;
}

// CREATE BOOKING
exports.createBooking = (req, res) => {
    const {
        client_name,
        client_phone,
        event_date,
        event_time,
        location_name,
        location_address,
        google_maps_link,
        package_id
    } = req.body;

    if (!client_name || !client_phone || !event_date || !event_time) {
        return res.json({ message: "Data belum lengkap!" });
    }

    // VALIDASI DOUBLE BOOKING
    const checkQuery = `
        SELECT COUNT(*) as total 
        FROM events 
        WHERE event_date = ? 
        AND status != 'cancelled'
    `;

    db.query(checkQuery, [event_date], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result[0].total > 0) {
            return res.json({
                message: "Tanggal sudah dibooking!"
            });
        }

        const invoice = generateInvoice();

        const insertQuery = `
            INSERT INTO events 
            (invoice_number, client_name, client_phone, event_date, event_time, location_name, location_address, google_maps_link, package_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [
            invoice,
            client_name,
            client_phone,
            event_date,
            event_time,
            location_name,
            location_address,
            google_maps_link,
            package_id
        ], (err) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "Booking berhasil!",
                invoice
            });
        });
    });
};

// GET PACKAGES
exports.getPackages = (req, res) => {
    db.query("SELECT * FROM wedding_packages WHERE is_active = 1", (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
};