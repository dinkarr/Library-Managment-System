// Before importing any object/fn we have to export that object/fn and then only we can import it in some other module 
// Importing admin home page and will redirect based on the role 

import Admin from "./Admin.js"
import User from "./User.js"
// import User_Profile from "./User_Profile.js"

// Changed User to User_profile
export default{
    template: `<div>
    <User v-if="user_role=='user'"/> 
    <Admin v-if="user_role=='librarian'"/> 
    
    </div>`,

    data(){
        return {
            user_role : localStorage.getItem('role'),
        }
    },

    components:{
        User,
        Admin,
    }
}

