import Layout from "./Layout";

const HomeLayout = ({children}) => {
    return(
        <Layout>
            <div style={{background: "linear-gradient(rgba(0, 0, 0, 0.5) 100%, rgba(0, 0, 0, 0.5) 100%),url(images/home-background-pattern.jpg)"}}>
                { children }
            </div>
        </Layout>
    );
}

export default HomeLayout;