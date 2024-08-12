export default{
    template:`
    <div>
        <canvas id="booksChart" width="400" height="400"></canvas>
        <canvas id="sectionsChart" width="400" height="400"></canvas>
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
                this.all_books = data
                await this.fetchBook()
            }
            else{
                alert(data.message)
            }
        },

        async fetchUser(){
            const res = await fetch('/user_info' ,{
                headers: {
                    "Authentication-Token":this.auth_token,
    
                },
            })
            const data = await res.json()
            if(res.ok){
                this.all_users = data
                await this.fetchUser();
            }
        },


        

    },


    async mounted() {
        await this.fetchBook();
        await this.fetchUser();
    }


}