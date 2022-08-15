import Layout from "./Layout";

const ChatLayout = ({children}) => {
    return(
        <Layout>
            <div style={{background: "linear-gradient(rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5) 100%),url(images/chat-background-pattern.webp)"}}>
                { children }
            </div>
        </Layout>
    );
}

export default ChatLayout;