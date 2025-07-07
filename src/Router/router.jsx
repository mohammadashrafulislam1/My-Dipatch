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
                element:<Order/>
            },
            {
                path:'task',
                element:<Task/>
            },
            {
                path:'chat',
                element:<Chat/>
            },
            {
                path:'support',
                element:<Support/>
            },
            {
                path:'wallet',
                element:<Wallet/>
            },
            {
                path:'profile',
                element:<Profile/>
            },
            {
                path:'settings',
                element:<Settings/>
            },
            {
                path:'notifications',
                element:<Notification/>
            },
        ]
    },
    {
        path:'/',
        element:<Customer/>,
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
])