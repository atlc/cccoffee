import * as express from 'express';
import * as passport from 'passport';
import {
    get_orders,
    get_one_order,
    post_order,
    edit_order,
    delete_order
} from '../../db/queries/orders';
import { get_one_drink } from '../../db/queries/drinks';


import { v4 as uuid_v4 } from 'uuid';
import { get_one_snack } from '../../db/queries/snacks';
import { post_drinksorder } from '../../db/queries/drinksorder';
import { post_snacksOrder } from '../../db/queries/snacksorder';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const orders = await get_orders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error in server route", error: error.sqlMessage });
    }
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await get_one_order(id);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error in server route", error: error.sqlMessage });
    }
});
router.post('/', async (req, res) => {
    const { first_name, drink_ids, snack_ids } = req.body;
    try {
        const id = uuid_v4();
        const newOrder = { id, first_name };
        await post_order(newOrder);

        for await (const drink_id of drink_ids) {
            const drinksOrder = { drink_id, order_id: id };
            await post_drinksorder(drinksOrder);
        }
        for await (const snack_id of snack_ids){
            const snacksOrder = { snack_id, order_id: id };
            await post_snacksOrder(snacksOrder);
        }

        res.json({ message: "Order created!", id });
    } catch (error) {
        res.status(500).json({ message: "Error in server route", error: error.sqlMessage });
    }
});
router.put('/:id', passport.authenticate('jwt'), async (req, res) => {
    const { id } = req.params;
    const { first_name, drink_id, snack_id } = req.body;
    try {
        const [drink] = await get_one_drink(drink_id);
        const [snack] = await get_one_snack(snack_id);
        const editOrder = { first_name, drink_id: drink_id, snack_id: snack_id, price: (drink.price + snack.price) + (0.09 * (drink.price + snack.price)) };
        await edit_order(editOrder, id);
        res.json({ message: "Order editted" })
    } catch (error) {
        res.status(500).json({ message: "Error in server route", error: error.sqlMessage });
    }
});
router.delete('/:id', passport.authenticate('jwt'), async (req, res) => {
    const { id } = req.params;
    try {
        await delete_order(id);
        res.json({ message: "Order deleted!" })
    } catch (error) {
        res.status(500).json({ message: "Error in server route", error: error.sqlMessage });
    }
});

export default router;