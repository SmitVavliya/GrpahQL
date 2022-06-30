const { dateToString } = require("../../helpers/date");

const Event = require("../../models/event");
const User = require("../../models/user");

const populateEvents = async (eventIds) => {
    try {
        let events = await Event.find({ _id: { $in: eventIds } });
        events = events.map((event) => {
            return transformEvent(event);
        });

        return events;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const populateEvent = async (eventId) => {
    try {
        let event = await Event.findOne({ _id: eventId });
        event = transformEvent(event);    

        return event;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const populateUser = async (userId) => {
    try {
        let user = await User.findById(userId);
        user = {
            ...user.toJSON(),
            createdEvents: populateEvents.bind(this, user.createdEvents)
        }

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const transformEvent = (event) => {
    return {
        ...event.toJSON(),
        date: dateToString(event.date),
        creator: populateUser.bind(this, event.creator)
    }
}

const transformBooking = (booking) => {
    return {
        ...booking.toJSON(),
        event: populateEvent.bind(this, booking.event),
        user: populateUser.bind(this, booking.user),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt)               
    }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;