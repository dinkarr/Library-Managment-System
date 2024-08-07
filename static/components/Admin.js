
export default{
    template : `
    <div> 
        <br>
        <div :style="containerStyle">
            <table class="table">
            <thead>
                <tr>
                <th scope="col">User Name</th>
                <th scope="col">Book Name</th>
                <th scope="col">Request Date</th>
                <th scope="col">Returning Date</th>
                <th scope="col">Approve</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(request, index) in pending_req" :key="index" v-if="request.status === 'Requested'">
                <td>{{ request.user_name }}</td>
                <td>{{ request.book_name }}</td>
                <td>{{ request.req_date }}</td>
                <td>{{ request.ret_date }}</td>
                
                <td>
                <button  @click="approve_request(request.record_id)" class="btn btn-primary" >Approve</button>
                 </td>
                </tr>
            </tbody>
            </table>
        </div>
        <br>
        <div :style="containerStyle">
            <table class="table">
            <thead>
                <tr>
                <th scope="col">User Name</th>
                <th scope="col">Book Name</th>
                <th scope="col">Request Date</th>
                <th scope="col">Returning Date</th>
                <th scope="col">Approve</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(request, index) in pending_req" :key="index" v-if="request.status === 'Issued'">
                <td>{{ request.user_name }}</td>
                <td>{{ request.book_name }}</td>
                <td>{{ request.req_date }}</td>
                <td>{{ request.ret_date }}</td>
                
                <td>
                <button  @click="revoke_book(request.record_id)" class="btn btn-primary" >Revoke</button>
                 </td>
                </tr>
            </tbody>
            </table>
        </div>

    </div>`,
    data(){
        return{
            
            pending_req : [],
            auth_token: localStorage.getItem("auth_token"),
            role: localStorage.getItem("role"),
            containerStyle: {
                width: '88%',
                margin: '0 auto',
                border: '1px solid #ddd', 
                padding: '10px',
              },
            resource_approve:{
                req_id : null
            },
            resource_revoke:{
                req_id : null,
            },
        }
    },
    methods :{
        async request_list(){
            const res = await fetch('/api/record_query',{
                method:'GET',
                headers:{
                    "Authentication-Token": this.auth_token
                }
            })
            const data = await res.json()
            if(res.ok){
                this.pending_req = data
            }
            else{
                alert(data.message)
            }
        },
        async approve_request(bid){
            this.resource_approve.req_id = bid ;
            const res = await fetch('/api/approve_request',{
                method : 'POST',
                headers:{
                    "Authentication-Token": this.auth_token ,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.resource_approve),
            })
            const data = await res.json()
            if (res.ok){
                alert(data.message)
                await this.request_list()
            }
            else{
                alert(data.message)
            }
        },
        async revoke_book(bid){
            this.resource_revoke.req_id = bid ;
            const res = await fetch('/api/revoke_book',{
                method : 'POST',
                headers:{
                    "Authentication-Token": this.auth_token ,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.resource_revoke),
            })
            const data = await res.json()
            if (res.ok){
                alert(data.message)
                await this.request_list()
            }
            else{
                alert(data.message)
            }
        },





    },

    async mounted(){
        this.request_list() ;
    },
}