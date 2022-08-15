import { gql } from '@apollo/client'

export const CREATE_MESSAGE = gql`
    mutation CreateMessage($data: CreateMessageInput!) {
        createMessage(data: $data)
    }
`;

export const SUBSCRIPTION_MESSAGE_CREATED = gql`
    subscription MessageCreated {
        messageCreated {
            message
            timestamp
            user {
                id
                nickname
            }
        }
    }
`;