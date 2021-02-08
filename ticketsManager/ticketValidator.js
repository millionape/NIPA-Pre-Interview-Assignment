var validate = require("validate.js");
var statusType = require("../const/ticketStatusType");
var ticketStatusType = [statusType.pending, statusType.accepted, statusType.rejected, statusType.resolved];
var sortParameters = ["title", "description", "contactInfo", "createdDate", "updatedDate", "ticketId", "status"];

exports.validateCreateTicketData = function (ticketData) {
    var constraints = {
        title: {
            presence: true,
        },
        description: {
            presence: true,
        },
        contactInfo: {
            presence: true,
        }
    };
    return validate(ticketData, constraints);
};

exports.validateTicketQueryData = function (ticketData) {
    var constraints = {
        title: {
            presence: true,
        },
        description: {
            presence: true,
        },
        contactInfo: {
            presence: true,
        }
    };
    return validate(ticketData, constraints);
};

exports.validateTicketId = function (ticketId) {
    var constraints = {
        ticketId: {
            presence: true,
            length: {
                minimum: 36,
                message: "must be in uuid 36 characters format"
            }
        }
    };
    return validate(ticketId, constraints);
};

exports.validateTicketStatus = function (ticketStatus) {
    var constraints = {
        ticketStatus: {
            presence: true,
            inclusion: {
                within: ticketStatusType,
                message: `^Status must be in this following values [${ticketStatusType}]`
            }
        },
        ticketId: {
            presence: true,
            length: {
                minimum: 36,
                message: "must be in uuid 36 characters format"
            }
        }
    };
    return validate(ticketStatus, constraints);
};

exports.validateTicketQueryData = function (filterOptions) {
    if ('status' in filterOptions) {
        var constraints = {
            status: {
                presence: false,
                inclusion: {
                    within: ticketStatusType,
                    message: `^Status must be in this following values [${ticketStatusType}]`
                }
            }
        };
        var statusValidateResult = validate(filterOptions, constraints);
        if (statusValidateResult) {
            return statusValidateResult;
        }
    }
    if ('dateRage' in filterOptions) {
        validate.extend(validate.validators.datetime, {
            parse: function (value, options) {
                return +moment.utc(value);
            },
            format: function (value, options) {
                var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
                return moment.utc(value).format(format);
            }
        });
        var constraints = {
            "dateRage.startDate": {
                presence: true,
                datetime: true
            },
            "dateRage.endDate": {
                presence: true,
                datetime: true
            }
        };
        var statusValidateResult = validate(filterOptions, constraints);
        if (statusValidateResult) {
            return statusValidateResult;
        }
    }
    if ('sortBy' in filterOptions) {
        var constraints = {
            sortBy: {
                presence: false,
                inclusion: {
                    within: sortParameters,
                    message: `^Sort parameter must be in this following values [${sortParameters}]`
                }
            }
        };
        var statusValidateResult = validate(filterOptions, constraints);
        if (statusValidateResult) {
            return statusValidateResult;
        }
    }
    if ('page' in filterOptions) {
        var constraints = {
            page: {
                presence: false,
                numericality: {
                    onlyInteger: true,
                }
            }
        };
        var statusValidateResult = validate(filterOptions, constraints);
        if (statusValidateResult) {
            return statusValidateResult;
        }
    }

    return undefined;
};