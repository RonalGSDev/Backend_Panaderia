const router = require('express').Router();
const db = require('../db');

// Obtener días por local (Ya lo tienes)
router.get('/:localId', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM dias_encargos WHERE local_id = ?', [req.params.localId]);
    res.json(rows);
});

// NUEVA RUTA: Obtener el resumen de producción para el modal
router.get('/resumen-produccion/:diaId', async (req, res) => {
    const { diaId } = req.params;
    try {
        const query = `
            SELECT 
                p.nombre AS nombre, 
                SUM(dp.cantidad) AS solicitado,
                SUM(CASE WHEN pe.estado = 1 THEN dp.cantidad ELSE 0 END) AS entregado
            FROM detalle_pedido dp
            JOIN pan p ON dp.pan_id = p.id
            JOIN pedidos pe ON dp.pedido_id = pe.id
            WHERE pe.dia_id = ?
            GROUP BY p.nombre
        `;
        const [rows] = await db.query(query, [diaId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el resumen" });
    }
});

module.exports = router;