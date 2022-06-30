const { transformBooking } = require("./merge");

const Booking = require("../../models/booking");

module.exports = {
    booking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        try {
            let bookings = await Booking.find();
            bookings = bookings.map((booking) => {
                return transformBooking(booking);
            });

            return bookings;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    bookEvent: async ({ eventId }, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        try {
            let booking = await Booking({
                user: req.user.userId,
                event: eventId,
            });
            await booking.save();

            booking = transformBooking(booking);

            return booking;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    cancelBooking: async ({ bookingId }, req) => {
        if(!req.isAuth) {
            throw new Error("Unauthenticated!");
        }

        try {
            let booking = await Booking.findById(bookingId);
            booking = transformBooking(booking);
 
            await Booking.deleteOne({ _id: bookingId });

            return booking;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}