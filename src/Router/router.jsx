import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Customer/Dashboard/Dashboard";
import Order from "../pages/Customer/Dashboard/Orders";
import Chat from "../pages/Customer/Dashboard/Chat";
import Wallet from "../pages/Customer/Dashboard/Wallet";
import Default from "../pages/Customer/Dashboard/Default";
import Login from "../pages/Authentication/Login";
import Signup from "../pages/Authentication/Signup";
import Profile from "../pages/Customer/Profile/Profile";
import Settings from "../pages/Customer/Profile/Setting";
import Notification from "../pages/Customer/Profile/Notification";
import Customer from "../pages/Customer/Customer";
import Support from "../pages/Customer/Dashboard/Support";
import Task from "../pages/Customer/Dashboard/Task";
import LandingPage from "../pages/Customer/LandingPage";
import AccountPage from "../pages/Customer/Account";
import PrivateRoute from "./PrivateRouter";
import Services from "../pages/Services";
import About from "../pages/About";
import Blogs from "../pages/Blogs";
import Locations from "../pages/Locations";

export const router = createBrowserRouter([
    {
        path:'/dashboard',
        element:<Dashboard/>,
        errorElement:<h1>err</h1>,
        children:[
            {
                path:'',
                element:<Default/>
            },
            {
                path:'orders',
                element:<PrivateRoute><Order/></PrivateRoute>
            },
            {
                path:'task',
                element:<PrivateRoute><Task/></PrivateRoute>
            },
            {
                path:'chat',
                element:<PrivateRoute><Chat/></PrivateRoute>
            },
            {
                path:'support',
                element:<PrivateRoute><Support/></PrivateRoute>
            },
            {
                path:'wallet',
                element:<PrivateRoute><Wallet/></PrivateRoute>
            },
            {
                path:'profile',
                element:<PrivateRoute><Profile/></PrivateRoute>
            },
            {
                path:'settings',
                element:<PrivateRoute><Settings/></PrivateRoute>
            },
            {
                path:'notifications',
                element:<PrivateRoute><Notification/></PrivateRoute>
            },
        ]
    },
    {
        path:'/',
        element:<LandingPage/>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/account',
        element:<PrivateRoute><AccountPage/></PrivateRoute>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/login',
        element:<Login/>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/signup',
        element:<Signup/>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/services',
        element:<Services/>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/about',
        element:<About/>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/locations',
        element:<Locations/>,
        errorElement:<h1>err</h1>
    },
    {
        path:'/blog',
        element:<Blogs/>,
        errorElement:<h1>err</h1>
    },
])