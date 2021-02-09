let _ = require("lodash"); 
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

exports.deleteTicket = function (ticketId) {
    try {
        let tickets = db.get('tickets').remove({ ticketId: ticketId }).write()
        console.log(tickets)
        if(tickets.length > 0){
            return `ticket id: ${ticketId} has beeen removed`;
        }else{
            return `can not find ticket that matched ${ticketId}`;
        }
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
        .assign({ updatedDate: moment().utc().format()})
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

exports.queryTicket = function (filterData) {
    var page = null;
    var itemsPerPage = null;
    let query = db.get('tickets');
    if("status" in filterData){
        query = query.filter({status: filterData.status});
    }
    if("dateRange" in filterData){
        var startDate = moment(filterData.dateRange.startDate).unix();
        var endDate = moment(filterData.dateRange.endDate).unix();
        query = query.filter(item => startDate <= moment(item.createdDate).unix() && moment(item.createdDate).unix() <= endDate);
    }
    if("sortBy" in filterData){
        query = query.sortBy(filterData.sortBy);
    }
    if("pagination" in filterData){
        page = filterData.pagination.page;
        itemsPerPage = filterData.pagination.itemsPerPage;
    }    

    try {
        let ticket = query.value();
        if(page !== null && itemsPerPage !== null){
            ticket = _.chunk(ticket,itemsPerPage);
            if(page < 0 || page > ticket.length){
                return {}
            }
            return {tickets: ticket[page-1], totalPage: ticket.length, currentPage: page};
        }
        return ticket;
    } catch (error) {
        return error;
    }
}