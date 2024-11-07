const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./mini-debt-system.db", (err) => {
	if (err) {
		console.error("Error opening database", err);
	} else {
		db.run(
			`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                username TEXT,
                email TEXT,
                password TEXT,
                userType TEXT,
                resetPasswordToken TEXT,
                resetPasswordExpires INTEGER
            )
        `,
			(err) => {
				if (err) {
					console.log("Error creating users table.", err);
				} else {
					console.log("Users table created successfully.");
				}
			}
		);

		db.run(
			`
            CREATE TABLE IF NOT EXISTS debts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                debtorName TEXT,
                originalAmount REAL,
                remainingBalance REAL,
                totalPaid REAL,
                createdAt TEXT,
                lastPaymentDate TEXT,
                status TEXT,
                userId INTEGER,
                FOREIGN KEY(userId) REFERENCES users(id)
            )
        `,
			(err) => {
				if (err) {
					console.log("Error creating debts table.", err);
				} else {
					console.log("Debts table created successfully.");
				}
			}
		);
	}
});

module.exports = db;
