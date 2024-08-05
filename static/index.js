// Creating a vue instance

import router from "./router.js"
import NavBar from './components/NavBar.js'

// const isAuth = localStorage.getItem('auth_token') ? true : false

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && to.name !== 'Signup' && !localStorage.getItem('auth_token') ? true : false) next({ name: 'Login' })
    else next() 
})

new Vue({
    el: "#app" ,  // el tells where to mount 
    router,
    template: `<div>
                    <NavBar />
                    <router-view />
                    
                </div>`,
    // When ever we are using a a local component , we have to register them inside components
    components:{
        NavBar,
    }
})


