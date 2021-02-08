const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const status = require('../const/ticketStatusType')
const {
    v4: uuidv4
} = require('uuid');
var moment = require('moment');

const db = low(adapter)
// incase of db.js is empty
// db.defaults({tickets: []}).write()

exports.createTicket = function (ticketData) {
    const formData = {
        title: ticketData.title,
        description: ticketData.description,
        contactInfo: ticketData.contactInfo,
        createdDate: moment().utc().format(),
        updatedDate: moment().utc().format(),
        ticketId: uuidv4(),
        status: status.pending // set default status to pending
    }
    try {
        db.get('tickets').push(formData).write() // store ticket data to our db
        return (`created, ticketId: ${formData.ticketId}`);
    } catch (error) {
        return error;
    }
};

exports.setTicketStatus = function (ticketData) {
    try {
        let setTicketStatusResult = db.get('tickets')
        .find({ticketId: ticketData.ticketId})
        .assign({ status: ticketData.ticketStatus})
        .write()
        console.log('set status : ',setTicketStatusResult);
        if(setTicketStatusResult.ticketId === ticketData.ticketId){
            return `Status [${ticketData.ticketStatus}] has been set for ticket id [${ticketData.ticketId}]`;
        }
        return `Can not find ticketId that matched [${ticketData.ticketId}]`;
    } catch (error) {
        return error;
    }
}

exports.getAllTickets = function () {
    try {
        let tickets = db.get('tickets').value();
        return tickets;
    } catch (error) {
        return error;
    }
}

exports.getTicket = function (ticketId) {
    try {
        let ticket = db.get('tickets').find({
            ticketId: ticketId
        }).value();
        return ticket;
    } catch (error) {
        return error;
    }
}

exports.queryTicket = function (filterData) {
    try {
        let ticket = db.get('tickets').find({
            ticketId: ticketId
        }).value();
        return ticket;
    } catch (error) {
        return error;
    }
}

exports.setTicketStatus = function (ticketData) {
    try {
        let setTicketStatusResult = db.get('tickets')
        .find({ticketId: ticketData.ticketId})
        .assign({ status: ticketData.ticketStatus})
        .write()
        console.log('set status : ',setTicketStatusResult);
        if(setTicketStatusResult.ticketId === ticketData.ticketId){
            return `Status [${ticketData.ticketStatus}] has been set for ticket id [${ticketData.ticketId}]`;
        }
        return `Can not find ticketId that matched [${ticketData.ticketId}]`;
    } catch (error) {
        return error;
    }
}