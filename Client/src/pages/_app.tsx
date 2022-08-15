import 'styles/globals.css'
import type { AppProps } from 'types/AppProps'
import { Layouts } from 'layouts';
import { PublicRoute, AuthenticatedRoute } from 'components';
import { AuthProvider } from 'hooks/useAuth';
import { ApolloProvider } from '@apollo/client'
import apolloClient from 'utils/apolloClient';

function MyApp({ Component, pageProps }: AppProps) {
  const Layout = Layouts[Component.Layout] || (({children}) => <>{children}</>);
  const Route = (Component.Auth) ? AuthenticatedRoute : PublicRoute;
  
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Layout>
          <Route Component={Component} {...pageProps}></Route>
        </Layout>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default MyApp
