// User home page hai
export default{
    template : `
    <div>
    <br>
    
        <div class="container">
            <div class="text-center mb-4">
                <h5>Recently Added Books</h5>
            </div>
            <div class="row">
                <div v-for="book in all_books" :key="book.id" class="col-md-3 mb-3">
                    <div class="card" style="padding: 0; width: 100%; height: 85%;">
                        <img :src="book.image" class="card-img-top" :alt="book.title" style="width: 100%; height: 65%; aspect-ratio: 3 / 4;">
                        <div class="card-body">
                            <h6 class="card-title">{{ book.title }}</h6>
                            <p class="card-text">Author: {{ book.author }}</p>
                            <p class="card-text">Subtitle: {{ book.subtitle }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    `,
    data(){
        return{
            all_books: [],
            all_users:[],
            auth_token : localStorage.getItem("auth_token"),
            
        }
    },

    methods:{
        async fetchBook(){
            const res =  await fetch('/api/add_book' , {
                method: 'GET',
                headers: {
                    "Authentication-Token":this.auth_token,
                },
            })
            const data = await res.json()
            if(res.ok){
                this.all_books = data.slice(-4)
                //await this.fetchBook()
            }
            else{
                alert(data.message)
            }
        },



        

    },


    async mounted() {
        this.fetchBook();
    }


}