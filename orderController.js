const Order = require('../models/order.js'); 

const viewAllOrders = async (req, res) => {
    try {
        //descending order by date
        const orders = await Order.find().sort({ time: -1, date: -1 });
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const viewOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findOne({ orderId: orderId });
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const filterOrders = async (req, res) => {
    try {
        const { status } = req.query;
        const orders = await Order.find({ status: status });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    viewAllOrders,
    viewOrder,
    filterOrders
};
