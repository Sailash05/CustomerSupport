// import Ticket from '../models/ticketModel.js';
const Ticket = require('../models/ticket.js'); 

const viewAllTickets = async (req, res) => {
  const query = req.query.query;
  const status = req.query.status;
  console.log("Query:", query);
  console.log("Status:", status);

  const matchStage = {};

  // 1. Strict filter for OPEN / CLOSED status
  if (status && (status === 'OPEN' || status === 'CLOSED')) {
    matchStage.status = status;
  }

  // 2. Search query matching customer name, customer id, and ticket id
  if (query) {
    matchStage.$or = [
      { customerName: { $regex: query, $options: 'i' } },
      { customerId: { $regex: query, $options: 'i' } },
      { ticketId: { $regex: query, $options: 'i' } }
    ];
  }

  try {
    const tickets = await Ticket.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "customerId",
          as: "customer"
        }
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true
        }
      },
      { $addFields: { customerName: "$customer.name" } },
      { $project: { customer: 0 } },
      // 3. Inject match conditions after customerName is available
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      { $sort: { time: -1, date: -1 } }
    ]);
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findOne({ ticketId: ticketId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const filterTickets = async (req, res) => {
  try {
    const { status } = req.query;
    const tickets = await Ticket.find({ status: status });
    res.json(tickets);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchTickets = async (req, res) => {
  try {
    const { query } = req.query; 
    
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const tickets = await Ticket.aggregate([
      {
        
        $lookup: {
          from: "customers",          
          localField: "customerId",
          foreignField: "customerId",
          as: "customerDetails"
        }
      },
      {
        $unwind: "$customerDetails"
      },
      {
        $match: {
          $or: [
            { "customerId": { $regex: query, $options: "i" } },
            { "customerDetails.name": { $regex: query, $options: "i" } }
          ]
        }
      },
      {
        $project: {
          customerDetails: 0 
        }
      }
    ]);

    res.status(200).json(tickets);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    viewAllTickets,
    viewTicket,
    filterTickets,
    searchTickets
};



// // import Ticket from '../models/ticketModel.js';
// const Ticket = require('../models/ticket.js'); 

// const viewAllTickets = async (req, res) => {
//     try {
//         //descending order by date
//         const tickets = await Ticket.find().sort({ time: -1, date: -1 });
//         console.log(tickets);
//         res.status(200).json(tickets);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

//  const viewTicket = async (req, res) => {
//   try {
//     const ticketId = req.params.id;
//     const ticket = await Ticket.findOne({ ticketId: ticketId });
//     if (!ticket) {
//       return res.status(404).json({ message: "Ticket not found" });
//     }
//     res.status(200).json(ticket);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//  const filterTickets = (req, res) => {
//   const { status } = req.query;
//   const tickets = Ticket.find({ status: status });
//   res.json(tickets);
// };

// module.exports = {
//     viewAllTickets
// };