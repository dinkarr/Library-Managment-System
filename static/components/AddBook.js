export default{
    template:`
    <div class='d-flex justify-content-center align-items-center' style="min-height: 80vh;">
    <div class="mb-3 p-5 bg-light" style="width: 90%; max-width: 600px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <form @submit.prevent="addbook">
            <div class="mb-3">
                <input type='text' placeholder='Book Title' v-model="resource.title" class="form-control" required>
            </div>
            <div class="mb-3">
                <input type='text' placeholder='Book Author' v-model="resource.author" class="form-control" required>
            </div>
            <div class="mb-3">
                <input type='text' placeholder='Book Sub Title' v-model="resource.subtitle" class="form-control" required>
            </div>
            <div class="mb-3">
                <input type='text' placeholder='Book Content' v-model="resource.content" class="form-control" required>
            </div>
            <div class="mb-3">
                <input type='text' placeholder='Book Image' v-model="resource.image" class="form-control" required>
            </div>
            <div class="mb-3">
                <input type='number' placeholder='Book Year' v-model="resource.year" class="form-control" required>
            </div>
            <div class="mb-3">
                <input type='text' placeholder='Book Section' v-model="resource.section_name" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Book</button>
        </form>
    </div>
</div>

    `,

    data(){
        return{
            resource:{
                title:null ,
                author:null ,
                subtitle:null ,
                content:null ,
                image:null ,
                year:null ,
                section_name:null ,
            },
            auth_token : localStorage.getItem("auth_token"),
        }
    },
    methods:{
        async addbook(){
            const res = await fetch('/api/add_book',{
                method : 'POST',
                headers : {
                    "Authentication-Token": this.auth_token ,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.resource),
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                this.$router.push({path : '/home'})
            }
            else{
                alert(data.message)
            }
        },
    },
}
// Book.js 

// Add_book variable : false and open the form , v-show 
// Multi line backtick 