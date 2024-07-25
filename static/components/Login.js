export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top:24vh">
    <form @submit.prevent="login_user">
        <div class="mb-3 p-5 bg-light">
            <label for="user_email" class="form-label">Email Address</label>
            <input type="email" class="form-control" id="user_email" placeholder = 'Type Your Mail' v-model='uc.email'>
            <label for="user_password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user_password" placeholder = 'Type Your Password' v-model='uc.password'>
            <button type="submit" class="btn btn-primary mt-4" @click='login_user'>Submit</button>
         </div>
        
    </form>
    </div>
    `
    ,
    // Now we have to bind the values of the form input to some variable and send a request to backend .
    data(){
        return{
            uc:{
                email: null,
                password: null,
            },
        }
    },
    // Now lets write the methods
    methods:{
        async login_user(){
            const res = await fetch('/user_login',{
                method:'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body:JSON.stringify(this.uc),
            })
            if(res.ok){
                const data = await res.json() // Read the response as json and convert into javascript object
                // Now we have the data and want to save it in local storage 
                localStorage.setItem('auth_token',data.token)
                localStorage.setItem('role',data.role)
                localStorage.setItem('email',data.email)
                // Now the user is loged in , i am pussing to home page 
                this.$router.push('/home')
            }
        }
    },
}
