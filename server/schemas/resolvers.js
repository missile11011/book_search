const { User } = require("../models");
const { signToken } = require ("../utils/auth")
// const {login, createUser, saveBook, deleteBook} = require("../controllers/user-controller");
// Create the functions that fulfill the queries defined in `typeDefs.js`
const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			console.log("context:",context)
			// Get and return all documents from the classes collection
			return await User.findOne({_id: context.user._id});
		},
	},
	Mutation: {
		addUser: async (parent, { username, email, password }) => {
			const user = await User.create({ username, email, password });
			const token = signToken(user);
			return { token, user };
		},
		login: async (parent, { username, email, password }) => {
			const user = await User.findOne({
				$or: [{ username }, { email }],
			});
			if (!user) {
				return Error("incorrect username")
			}
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) {
				return Error("incorrect password")
			}
			const token = signToken(user);
			return { token, user };
		},     
		saveBook: async (parent, args, { user }) => {
			console.log(user);    
			// try {
				const updatedUser = await User.findOneAndUpdate(
					{ _id: user._id },
					{ $addToSet: { savedBooks: args } },
					{ new: true, runValidators: true }
				);
				return updatedUser;
			// } catch (err) {
			// 	console.log(err);
			// 	return err;
			// }
		},
		removeBook: async (parent, {bookId},{user}) => {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: user._id },
				{ $pull: { savedBooks: { bookId } } },
				{ new: true }
			);
			if (!updatedUser) {
				return updatedUser
			}
			return 
		}
	}
};

module.exports = resolvers;
