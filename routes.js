const orderController = require('../controllers/orderController.js');
const ticketController = require('../controllers/ticketController.js');

const routes = (app) => {
    // Orders
    app.get('/orders', orderController.viewAllOrders);
    app.get('/orders/filter', orderController.filterOrders);
    app.get('/orders/:id', orderController.viewOrder); 
    // Tickets
    app.get('/tickets', ticketController.viewAllTickets);
    // app.get('/tickets/filter', ticketController.filterTickets);
    // app.get('/tickets/search', ticketController.searchTickets); 
    // app.get('/tickets/:id', ticketController.viewTicket);      
};

module.exports = routes;
