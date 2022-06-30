const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 

const User = require("../../models/user");

module.exports = {
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if(!user) {
                throw new Error("User doesn't exist!");
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if(!isEqual) {
                throw new Error("Password is incorrect!");
            }    
            const token = jwt.sign({ userId: user.id, email: user.email }, "somesupersecretkey", {
                expiresIn: "1h"
            });        

            return { userId: user.id, token, tokenExpiration: 1 }
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async ({ userInput }) => {
        try {
            const user = await User.findOne({ email: userInput.email });
            if(user) {
                throw new Error("User already exists.");
            }
            const hashedPassword = await bcrypt.hash(userInput.password, 12);
            const newUser = new User({
                email: userInput.email,
                password: hashedPassword
            });
            await newUser.save();

            return newUser;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
}