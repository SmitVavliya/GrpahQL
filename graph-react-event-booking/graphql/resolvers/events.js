const { transformEvent } = require("./merge");

const Event = require("../../models/event");
const User = require("../../models/user");

module.exports = {
    events: async () => {
        try {
            let events = await Event.find();
            events = events.map((event) => {
                return transformEvent(event);
            });

            return events;
        } catch(err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async ({ eventInput }, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        try {
            let event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                price: eventInput.price,
                date: new Date().toISOString(),
                creator: req.user.userId
            });
            await event.save();
            const user = await User.findById(req.user.userId);
            user.createdEvents.push(event);
            await user.save();

            event = transformEvent(event);

            return event;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
}