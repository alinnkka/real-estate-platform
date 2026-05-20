const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send("Сервер KeySpace працює");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend успішно підключено"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "PostgreSQL підключено успішно",
            time: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка підключення до PostgreSQL",
            error: error.message
        });
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password, avatar } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Користувач уже існує"
            });
        }

        const newUser = await pool.query(
            `INSERT INTO users (name, email, password, avatar)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, avatar`,
            [name, email, password, avatar]
        );

        res.status(201).json({
            message: "Реєстрація успішна",
            user: newUser.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: "Помилка сервера",
            error: error.message
        });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const userResult = await pool.query(
            "SELECT id, name, email, password, avatar FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "Користувача з таким email не знайдено"
            });
        }

        const user = userResult.rows[0];

        if (user.password !== password) {
            return res.status(400).json({
                message: "Неправильний пароль"
            });
        }

        const { password: _, ...safeUser } = user;

        res.json({
            message: "Вхід успішний",
            user: safeUser
        });

    } catch (error) {
        res.status(500).json({
            message: "Помилка сервера",
            error: error.message
        });
    }
});
app.get("/api/users/:id/avatar", async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(
            "SELECT avatar FROM users WHERE id = $1",
            [userId]
        );

        if (result.rows.length === 0 || !result.rows[0].avatar) {
            return res.json({
                avatar: "avatar.png"
            });
        }

        res.json({
            avatar: result.rows[0].avatar
        });

    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання аватара",
            error: error.message
        });
    }
});

app.post("/api/properties", async (req, res) => {
    try {
        const {
            user_id,
            title,
            city,
            district,
            type,
            deal,
            rooms,
            area,
            price,
            floor,
            state,
            phone,
            description,
            image,
            photos
        } = req.body;

        const newProperty = await pool.query(
            `INSERT INTO properties
            (user_id, title, city, district, type, deal, rooms, area, price, floor, state, phone, description, image, photos)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING *`,
            [
                user_id,
                title,
                city,
                district,
                type,
                deal,
                rooms,
                area,
                price,
                floor,
                state,
                phone,
                description,
                image,
                JSON.stringify(photos)
            ]
        );

        res.status(201).json({
            message: "Оголошення додано",
            property: newProperty.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: "Помилка додавання оголошення",
            error: error.message
        });
    }
});

app.get("/api/properties", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                properties.*,
                users.name AS seller_name,
                users.avatar AS seller_avatar
            FROM properties
            JOIN users ON properties.user_id = users.id
            ORDER BY properties.created_at DESC
        `);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання оголошень",
            error: error.message
        });
    }
});

app.delete("/api/properties/:id", async (req, res) => {
    try {
        const propertyId = req.params.id;

        await pool.query(
            "DELETE FROM properties WHERE id = $1",
            [propertyId]
        );

        res.json({
            message: "Оголошення видалено"
        });

    } catch (error) {
        res.status(500).json({
            message: "Помилка видалення оголошення",
            error: error.message
        });
    }
});
app.get("/api/users/:id/properties", async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await pool.query(
            "SELECT * FROM properties WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання оголошень користувача",
            error: error.message
        });
    }
});
app.put("/api/properties/:id", async (req, res) => {
    try {
        const propertyId = req.params.id;

        const {
            title, city, district, type, deal, rooms, area, price,
            floor, state, phone, description, image, photos
        } = req.body;

        const updatedProperty = await pool.query(
            `UPDATE properties
             SET title=$1, city=$2, district=$3, type=$4, deal=$5,
                 rooms=$6, area=$7, price=$8, floor=$9, state=$10,
                 phone=$11, description=$12, image=$13, photos=$14
             WHERE id=$15
             RETURNING *`,
            [
                title, city, district, type, deal, rooms, area, price,
                floor, state, phone, description, image,
                JSON.stringify(photos),
                propertyId
            ]
        );

        res.json({
            message: "Оголошення оновлено",
            property: updatedProperty.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            message: "Помилка оновлення оголошення",
            error: error.message
        });
    }
});
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});

server.on("error", error => {
    console.log("Помилка запуску сервера:", error.message);
});

process.stdin.resume();