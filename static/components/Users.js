export default{
    template:`
      <div>
      <div>Users Page where we are rendering the info</div>
      <div v-for="(user, index) in all_users" :key="index">{{ user.email }}</div>
    </div>
    `,

    data(){
        return{
            all_users:[],
            auth_token: localStorage.getItem("auth_token"),
            role: localStorage.getItem("role"),
        }
    },
    async mounted(){
        const res = await fetch('/user_info' ,{
            headers: {
                "Authentication-Token":this.auth_token,

            },
        })
    const data = await res.json()
    if(res.ok){
        this.all_users = data
    }
    },
}