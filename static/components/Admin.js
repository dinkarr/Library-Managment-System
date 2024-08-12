
export default{
    template : `
    <div> 
        <br>
        <div :style="containerStyle">
            <div style="text-align: center; margin-bottom: 15px;">
                <h5 style="margin-bottom: 10px;">Rending Requests</h5>
                <hr style="border: 1px solid #ddd; width: 60%; margin: 0 auto;">
            </div>
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
            <div style="text-align: center; margin-bottom: 15px;">
                <h5 style="margin-bottom: 10px;">Issued Books</h5>
                <hr style="border: 1px solid #ddd; width: 60%; margin: 0 auto;">
            </div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">User Name</th>
                <th scope="col">Book Name</th>
                <th scope="col">Request Date</th>
                <th scope="col">Returning Date</th>
                <th scope="col">Revoke</th>
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
        <br>
        <div :style="containerStyle">
            <button  @click="export_job" class="btn btn-primary" >Export Book CSV</button>
        <div>
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
            exp_job : null ,
        }
    },
    methods :{
        async export_job(){
            const res = await fetch('/start_export',{
                method:'GET',
                headers:{
                    "Authentication-Token": this.auth_token
                }
            })
            const data = await res.json()
            if(res.ok){
                this.exp_job = data
            }
            else{
                alert(data.message)
            }
        }
        ,

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