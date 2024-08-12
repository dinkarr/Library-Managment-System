export default{
    template:`
      <div>
      <div>Users Page where we are rendering the info</div>
        <div :style="containerStyle">
            <table class="table">
            <thead>
                <tr>
                <th scope="col">User ID</th>
                <th scope="col">User Name</th>
                <th scope="col">User Email</th>
                <th scope="col">User Status</th>
                <th scope="col">Activate</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in all_users" :key="index">
                <td>{{ user.id }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                    <span v-if="user.active">Active</span>
                    <span v-else>In-Active</span>
                </td>
                <td>
                <button :disabled="user.active" class="btn btn-primary" @click="activate_user(user.id)">
                Activate
                </button>
                 </td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>
    
    `,

    data(){
        return{
            all_users:[],
            auth_token: localStorage.getItem("auth_token"),
            role: localStorage.getItem("role"),
            containerStyle: {
                width: '88%',
                margin: '0 auto',
                border: '1px solid #ddd', 
                padding: '10px',
              }
        }
    },
    methods:{
        async activate_user(user_id){
            const res = await fetch(`/activate/user/${user_id}`,{
                headers: {
                    "Authentication-Token":this.auth_token,
                },
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
            }
    
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