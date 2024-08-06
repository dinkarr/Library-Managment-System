export default{
    template:`
     

    <div>
    <input type='text' placeholder='Book Title' v-model="resource.title">
    <input type='text' placeholder='Book Author' v-model="resource.author"></input>
    <input type='text' placeholder='Book Sub Title' v-model="resource.subtitle"></input>
    <input type='text' placeholder='Book Content' v-model="resource.content"></input>
    <input type='text' placeholder='Book Image' v-model="resource.image"></input>
    <input type='integer' placeholder='Book Year' v-model="resource.year"></input>
    <input type='text' placeholder='Book Section' v-model="resource.section_name"></input>
    <button @click="addbook">Add Book</button>
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
            }
        },
       

    },
}
// Book.js 

// Add_book variable : false and open the form , v-show 
// Multi line backtick 