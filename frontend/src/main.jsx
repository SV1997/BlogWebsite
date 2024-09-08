import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Components/Home.jsx'
import store from './store/store'
import AddPost from './Components/AddPost.jsx'
import Trending from './Components/Trendings/Trending.jsx'
import Login from './Components/Login.jsx'
import Signup from './Components/Signup.jsx'
import AuthLayout from './Components/AuthLayout.jsx'
import Profile from './Components/Profile.jsx'
import Explore from './Components/Explore.jsx'
import Profiles from './Components/Profiles.jsx'
import Notification from './Components/Notifications.jsx'
import Messages from './Components/Messages.jsx'
const router= createBrowserRouter([{
  path:'/',
  element:<App/>,
  children:[
    {
      
      path:'/',
      element:(
        <AuthLayout authentication>
        <Home/>
        </AuthLayout>)
    },
    {
      path:'/post',
      element: (
      <AuthLayout authentication>
        <Home/>
        </AuthLayout>
      )
    },
    {
      path:'/trending',
      element: (
      <AuthLayout authentication>   
      <Trending/>
        </AuthLayout>
      )
    },
    {
      path:'/add-post',
      element:(<AuthLayout authentication><AddPost/></AuthLayout>)
    },
    {
      path:'/login',
      element:(<AuthLayout authentication={true}><Login/></AuthLayout>)
    },
    {
      path:'/signup',
      element:(<Signup/>)
    },
    {
      path:'/profile',
      element:(<AuthLayout authentication><Profile/></AuthLayout>)
    },
    {
      path:'/notification',
      element:(<AuthLayout authentication><Notification/></AuthLayout>)
    },
    {
      path:'/explore',
      element:(<AuthLayout authentication><Explore/></AuthLayout>)
    },
    {
      path:'/profiles',
      element:(<AuthLayout authentication><Profiles/></AuthLayout>)
    },
    {
        path:'/message',
        element:(<AuthLayout authentication><Messages/></AuthLayout>)
    }
  ]

}])
ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>

)
