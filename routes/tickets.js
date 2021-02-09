var express = require('express');
var router = express.Router();
var ticketManager = require('../ticketsManager/ticketsManagerController');
var validator = require('../ticketsManager/ticketValidator');

/**
 *  This handler will return all tickets in database
 */
router.get('/getAllTickets', function (req, res, next) {
  res.json(ticketManager.getAllTickets());
});

/**
 *  This handler will return ticket that matched with given ticketId
 */
router.get('/getTicket', function (req, res, next) {
  let validateResult = validator.validateTicketId({ticketId: req.query.ticketId});
  if (validateResult) {
    res.status(400);
    res.json({error: validateResult})
  } else {
    let tickets = ticketManager.getTicket(req.query.ticketId);
    res.status(200);
    res.json({
      result: tickets
    })
  }
});

/**
 *  This handler is for set the ticket status
 */
router.post('/setTicketStatus', function (req, res, next) {
  let validateResult = validator.validateTicketStatus(req.body);
  if (validateResult) {
    res.status(400);
    res.json({error: validateResult})
  } else {
    let setResult = ticketManager.setTicketStatus(req.body);
    res.status(201);
    res.json({
      result: setResult
    })
  }
});

/**
 *  This handler will create a new ticket and store it into database
 */
router.post('/createNewTicket', function (req, res, next) {
  let validateResult = validator.validateCreateTicketData(req.body);
  if (validateResult) {
    res.status(400);
    res.json({error: validateResult})
  } else {
    let createResult = ticketManager.createTicket(req.body);
    res.status(201);
    res.json({
      result: createResult
    })
  }
});

/**
 *  This handler will query tickets with given conditions
 */
router.post('/getTickets', function (req, res, next) {
  let validateResult = validator.validateTicketQueryData(req.body);
  if (validateResult) {
    res.status(400);
    res.json({error: validateResult})
  } else {
    res.status(200);
    let queryResult = ticketManager.queryTicket(req.body);
    console.log("queryResult: "+queryResult);
    if(typeof queryResult == "object"){
      var tickets = queryResult.tickets;
      // set the total page into the response header
      res.header("totalPage", queryResult.totalPage);
      res.header("currentPage", queryResult.currentPage);
    }
    res.json({
      result: queryResult
    })
  }
});

/**
 *  This handler will remove the specific ticket from database 
 */
router.delete('/deleteTicket', function (req, res, next) {
  let validateResult = validator.validateTicketId({ticketId: req.query.ticketId});
  if (validateResult) {
    res.status(400);
    res.json({error: validateResult})
  } else {
    let tickets = ticketManager.deleteTicket(req.query.ticketId);
    res.status(200);
    res.json({
      result: tickets
    })
  }
});

module.exports = router;