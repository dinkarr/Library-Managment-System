// Creating a vue instance

import router from "./router.js"
import NavBar from './components/NavBar.js'


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


