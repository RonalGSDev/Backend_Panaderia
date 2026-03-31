const router = require('express').Router();
const db = require('../db');

// Obtener pedidos por día
router.get('/dia/:diaId', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedidos WHERE dia_id = ?', [req.params.diaId]);
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});

// Obtener detalles (panes) de un pedido
router.get('/:id/detalle', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT dp.*, p.nombre, p.precio 
            FROM detalle_pedido dp 
            JOIN pan p ON dp.pan_id = p.id 
            WHERE pedido_id = ?`, [req.params.id]);
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
});

// GUARDAR NUEVO
router.post('/', async (req, res) => {
    const { cliente, telefono, total, anticipo, dia_id, detalles } = req.body;
    try {
        const [resP] = await db.query(
            'INSERT INTO pedidos (cliente, telefono, total, anticipo, dia_id, estado) VALUES (?,?,?,?,?,0)', 
            [cliente, telefono, total, anticipo, dia_id]
        );
        for (let it of detalles) {
            await db.query(
                'INSERT INTO detalle_pedido (pedido_id, pan_id, cantidad, subtotal) VALUES (?,?,?,?)',
                [resP.insertId, it.pan_id, it.cantidad, (it.cantidad * it.precio)]
            );
        }
        res.json({ ok: true });
    } catch (err) { res.status(500).json(err); }
});

// ACTUALIZAR
router.put('/:id', async (req, res) => {
    const { cliente, telefono, total, anticipo, detalles } = req.body;
    const id = req.params.id;
    try {
        await db.query('UPDATE pedidos SET cliente=?, telefono=?, total=?, anticipo=? WHERE id=?', 
            [cliente, telefono, total, anticipo, id]);
        await db.query('DELETE FROM detalle_pedido WHERE pedido_id = ?', [id]);
        for (let it of detalles) {
            await db.query('INSERT INTO detalle_pedido (pedido_id, pan_id, cantidad, subtotal) VALUES (?,?,?,?)',
                [id, it.pan_id, it.cantidad, (it.cantidad * it.precio)]);
        }
        res.json({ ok: true });
    } catch (err) { res.status(500).json(err); }
});

// ENTREGAR
router.put('/:id/entregar', async (req, res) => {
    try {
        await db.query('UPDATE pedidos SET estado = 1 WHERE id = ?', [req.params.id]);
        res.json({ ok: true });
    } catch (err) { res.status(500).json(err); }
});

// ELIMINAR
router.delete('/:id', async (req, res) => {
    await db.query('DELETE FROM pedidos WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
});

module.exports = router;