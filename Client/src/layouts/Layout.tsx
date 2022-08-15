import Head from 'next/head'
import styles from 'styles/layouts/Layout.module.css'

const Layout = ({ children }) => {
    return(
        <div className={styles.container}>
            <Head>
                <title>Anonymous Chat</title>
                <meta name="description" content="A chat application which is unknown who are using the chat." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                { children }
            </main>

            <footer className={styles.footer}>
                
            </footer>
        </div>
    );
}

export default Layout;