const db = require('./config/db');

const seedData = async () => {
    try {
        console.log('Clearing existing products and categories...');
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE products');
        await db.execute('TRUNCATE TABLE categories');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Inserting Categories...');
        const [teaCat] = await db.execute('INSERT INTO categories (name, description) VALUES (?, ?)', ['Tea', 'Freshly brewed hot teas']);
        const [snacksCat] = await db.execute('INSERT INTO categories (name, description) VALUES (?, ?)', ['Snacks', 'Delicious snacks to go with your chai']);

        const teaId = teaCat.insertId;
        const snacksId = snacksCat.insertId;

        console.log('Inserting Teas...');
        const teas = [
            { name: 'Cutting Chai', price: 15, desc: 'A strong, half-glass of classic Mumbai street style chai.' },
            { name: 'Masala Chai', price: 20, desc: 'Brewed with aromatic Indian spices for a perfect kick.' },
            { name: 'Ginger Tea', price: 20, desc: 'Fresh ginger infused tea, perfect for a sore throat or cold morning.' },
            { name: 'Lemon Tea', price: 25, desc: 'A refreshing, tangy tea with a hint of lemon and mint.' },
            { name: 'Green Tea', price: 30, desc: 'Healthy and rich in antioxidants.' },
            { name: 'Black Tea', price: 15, desc: 'Classic robust black tea without milk.' }
        ];

        for (const t of teas) {
            const imgUrl = `https://placehold.co/400x300/3e2723/fff3e0?text=${encodeURIComponent(t.name)}`;
            await db.execute(
                'INSERT INTO products (category_id, name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
                [teaId, t.name, t.desc, t.price, imgUrl, true]
            );
        }

        console.log('Inserting Snacks...');
        const snacks = [
            { name: 'Samosa', price: 15, desc: 'Crispy pastry filled with spicy potatoes and peas.' },
            { name: 'Bread Pakora', price: 20, desc: 'Deep-fried bread slices stuffed with spiced mashed potatoes.' },
            { name: 'Veg Puff', price: 25, desc: 'Flaky and buttery puff pastry filled with mixed vegetables.' },
            { name: 'Sandwich', price: 40, desc: 'Grilled vegetable sandwich with mint chutney.' },
            { name: 'Maggi', price: 50, desc: 'The classic 2-minute noodles cooked with veggies and magic masala.' },
            { name: 'Biscuits', price: 10, desc: 'Crunchy sweet and salty biscuits, best paired with chai.' }
        ];

        for (const s of snacks) {
            const imgUrl = `https://placehold.co/400x300/e65100/ffffff?text=${encodeURIComponent(s.name)}`;
            await db.execute(
                'INSERT INTO products (category_id, name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
                [snacksId, s.name, s.desc, s.price, imgUrl, true]
            );
        }

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
