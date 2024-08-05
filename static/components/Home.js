// Before importing any object/fn we have to export that object/fn and then only we can import it in some other module 
// Importing admin home page and will redirect based on the role 

import Admin from "./Admin.js"
import User from "./User.js"


export default{
    template: `<div>Welcome home from Home.js {{$route.query}} </div>`,

    data(){
        return {
            user_role : this.$route.query,
        }
    },

    components:{
        User,
        Admin,
    }
}

