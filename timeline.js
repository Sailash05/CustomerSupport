const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    timelineId: {
        type: String,
        required: true,
        unique: true
    },
    orderId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'TICKET_OPEN', 'TICKET_CLOSED'],
        default: 'OPEN'
    },
    date: {
        type: Date,
        default: Date.now
    },
    time: {
        type: String,
        default: new Date().toLocaleTimeString()
    }
});

module.exports = mongoose.model('Timeline', timelineSchema);