import Read_Book from "./Read_Book.js";

export default{
    template : `
    <div> 
        <div>
            <div v-if="selectedBook" style="padding: 20px; border: 1px solid #ddd; border-radius: 4px;">
            <Read_Book :book="selectedBook" @close="closeBook" /></div>
        </div>
        <br>
        <div :style="containerStyle">
            <div style="text-align: center; margin-bottom: 15px;">
                <h5 style="margin-bottom: 10px;">My Rending Requests</h5>
                <hr style="border: 1px solid #ddd; width: 60%; margin: 0 auto;">
            </div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Book Name</th>
                <th scope="col">Request Date</th>
                <th scope="col">Returning Date</th>
                <th scope="col">Status</th>
                <th scope="col">Cancle Request</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(request, index) in pending_req" :key="index" v-if="request.status === 'Requested'">
                <td>{{ request.book_name }}</td>
                <td>{{ request.req_date }}</td>
                <td>{{ request.ret_date }}</td>
                <td>{{ request.status }}</td>
                <td>
                <button  @click="approve_request(request.record_id)" class="btn btn-danger" >Cancle Request</button>
                 </td>
                </tr>
            </tbody>
            </table>
        </div>
        <br>
        <div :style="containerStyle">
            <div style="text-align: center; margin-bottom: 15px;">
                <h6 style="margin-bottom: 10px;">My Books</h6>
                <hr style="border: 1px solid #ddd; width: 60%; margin: 0 auto;">
            </div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Book Name</th>
                <th scope="col">Request Date</th>
                <th scope="col">Returning Date</th>
                <th scope="col">Read</th>
                <th scope="col">Return</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(request, index) in pending_req" :key="index" v-if="request.status === 'Issued'">
                <td>{{ request.book_name }}</td>
                <td>{{ request.req_date }}</td>
                <td>{{ request.ret_date }}</td>
                <td><button  @click="read(request.book_id)" class="btn btn-primary" >Read</button></td>
                <td><button  @click="revoke_book(request.record_id)" class="btn btn-danger" >Return</button></td>
                </tr>
            </tbody>
            </table>
        </div>

    </div>`,
    data(){
        return{
            selectedBook: null,
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
    components: {
        Read_Book,
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

        async read(bid) {
            const book = this.pending_req.find(request => request.book_id === bid);
            if (book) {
              this.selectedBook = book;
            } else {
              alert("Book not found");
            }
          },
          closeBook() {
            this.selectedBook = null;
          },





    },

    async mounted(){
        this.request_list() ;
    },
}