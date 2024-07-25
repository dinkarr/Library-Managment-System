import router from '../router.js'
export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top:24vh">
    <form @submit.prevent="user_signup">
    
        <div class="mb-3 p-5 bg-light">
            <label for="user_name" class="form-label">Email Address</label>
            <input type="user_name" class="form-control" id="user_name" placeholder = 'Type Your Name' v-model='uc.name'>
            <label for="user_email" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="user_email" placeholder = 'Type Your Mail' v-model='uc.email'>
            <label for="user_password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user_password" placeholder = 'Type Your Password' v-model='uc.password'>
            <button type="submit" class="btn btn-primary mt-4" @click='user_signup'>Submit</button>
         </div>
        
    </form>
    </div>
    `
    ,
    // Now we have to bind the values of the form input to some variable and send a request to backend .
    data(){
        return{
            uc:{
                name: null,
                email: null,
                password: null,
            },
            
        }
    },
    // Now lets write the methods
    methods:{
        async user_signup(){
            const res = await fetch('/signup',{
                method:'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify(this.uc),
            });
            if(res.ok){
                //const data = await res.json() // Read the response as json and convert into javascript object
                // Now the user is loged in , i am pussing to home page 
                router.push('/')
            }
        }
    },
}
