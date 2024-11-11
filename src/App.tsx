import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import {useAuth0, withAuthenticationRequired} from "@auth0/auth0-react";
import {useEffect} from "react";
import {AUTH0_AUDIENCE} from "./utils/constants.ts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen/>
    },
    {
        path: '/rules',
        element: <RulesScreen/>
    }
]);

export const queryClient = new QueryClient()
const App = () => {
    const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        // If the user is being redirected back from Auth0, handle the redirect and process the authentication
        const handleAuth = async () => {
            console.log("Is inside handleAuth")
                // If the user is authenticated, fetch the token and call the API
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently({authorizationParams: {audience: AUTH0_AUDIENCE}});
                    await callLogin(token);
                }
        };

        // Call the function to handle the login/redirect logic
        handleAuth();
    }, [isAuthenticated, isLoading, getAccessTokenSilently]);

    // Call your backend API with the access token
    const callLogin = async (token: string) => {
        console.log("Is inside callLogin: ", token)
        try {
            const response = await fetch('https://snippet-searcher.duckdns.org/permissions/users', {
                method: 'POST',
                headers: {
                    Authorization: `${token}`, // Include the access token in the Authorization header
                },
            });

            const data = await response.json();
            console.log('Backend response:', data);
        } catch (error) {
            console.error('Error calling backend API:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}

// To enable Auth0 integration change the following line
//export default App;
// for this one:
export default withAuthenticationRequired(App);
