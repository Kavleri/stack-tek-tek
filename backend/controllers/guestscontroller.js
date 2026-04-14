const db = require("../config/guestsConfig");

class GuestsController {

    // 🔹 GET semua tamu
    index(req, res) {
        const query = "SELECT guest_name, guest_phone, is_attended FROM guests";

        db.query(query, (err, results) => {
            if (err) {
                console.log("DB ERROR:", err); 
                return res.status(500).json({
                    message: "Error ambil data",
                    error: err
                });
            }

            const data = results.map(g => ({
                nama: g.guest_name,
                telepon: g.guest_phone,
                status: g.is_attended == 1 ? "Hadir" : "Tidak Hadir"
            }));

            res.json({
                message: "Menampilkan semua tamu",
                data
            });
        });
    }

    // 🔹 POST tambah tamu
    store(req, res) {
    const { guest_name, guest_phone } = req.body;

    if (!guest_name || !guest_phone) {
        return res.status(400).json({
            message: "Data tidak boleh kosong"
        });
    }

    const query = `
        INSERT INTO guests (event_id, guest_name, guest_phone, is_attended)
        VALUES (1, ?, ?, ?)
    `;

    db.query(query, [guest_name, guest_phone, 0], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Gagal tambah tamu",
                error: err
            });
        }

        res.json({
            message: "Berhasil tambah tamu",
            id: result.insertId
        });
    });
}


    // 🔹 PUT update status tamu
    update(req, res) {
        const { id } = req.params;
        const { is_attended } = req.body;

        const query = "UPDATE guests SET is_attended = ? WHERE id = ?";

        db.query(query, [is_attended, id], (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal update",
                    error: err
                });
            }

            res.json({
                message: `Berhasil update tamu ${id}`,
                status: is_attended == 1 ? "Hadir" : "Tidak Hadir"
            });
        });
    }

    // 🔹 DELETE hapus tamu
    destroy(req, res) {
        const { id } = req.params;

        const query = "DELETE FROM guests WHERE id = ?";

        db.query(query, [id], (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Gagal hapus",
                    error: err
                });
            }

            res.json({
                message: `Berhasil hapus tamu ${id}`
            });
        });
    }
}

module.exports = new GuestsController();