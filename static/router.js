// Will write all routers configrigation and will use router 3
// routes list is created and all elements of the list are the array are called route configarion and will be a object 
// the first thing will be path 
// willl map the path with the components , whwnever user visits that url the component will be displayed , for this will create a component folder and will write all the components their 

import Home from './components/Home.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'
import Users from './components/Users.js'
import AddBook from './components/AddBook.js'
import Books from './components/Books.js'
import Sections from './components/Sections.js'
import User_Profile from './components/User_Profile.js'
import Stats from './components/Stats.js'

const routes = [
    {path:'/' , component: Login  , name:'Login'}, // single configrations // i.e. when ever someone visits '/' then home.js will be rendered 
    // for namesin route , path:"/:name"
    {path: '/home' , component : Home},
    {path: '/signup' , component : Signup , name:'Signup'},
    {path: '/users' , component : Users },
    {path: '/addbook' , component : AddBook },
    {path: '/books' , component : Books },
    {path: '/sections' , component : Sections },
    {path: '/user_profile' , component : User_Profile },
    {path: '/stats' , component : Stats },
    
]


export default new VueRouter({ 
    
    routes  
})

//mode:"history",
