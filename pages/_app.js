import '../styles/globals.css'
import Layout from "../components/BasicLayout";

function MyApp({Component, pageProps}) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp
