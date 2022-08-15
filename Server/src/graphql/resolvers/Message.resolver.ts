module.exports = {
    Mutation: {
        createMessage: (_, { data: { message, userId } }, { db, pubsub }) => {
            var timestamp = Date.now().toString();
            // Publish events
            pubsub.publish("MESSAGE_CREATED", { messageCreated: {
                message,
                userId,
                timestamp
            }});
            return true;
        },
    },
    Subscription: {
        messageCreated: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("MESSAGE_CREATED") 
        }
    },
    Message: {
        user: (parent, __, { db : { JoinedUsers }}) => JoinedUsers.find(x => x.id === parent.userId)
    }
}