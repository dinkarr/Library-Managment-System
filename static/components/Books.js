export default{
    template:`
    <div style="margin: 2%;">
    <div v-if="all_books && all_books.length" class="row">
        <div v-for="book in all_books" :key="book.id" class="col-md-2 mb-3">
            <div class="card" style="padding: 0; width: 100%; height: 100%;">
                <img :src="book.image" class="card-img-top" :alt="book.title" style="width: 100%; height: 175px; object-fit: cover;">
                <div class="card-body" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h6 class="card-title">{{ book.title }}</h6>
                        <p class="card-text">Author : {{ book.author }}</p>
                        <p class="card-text">Subtitle : {{ book.subtitle }}</p>
                        <p class="card-text">Section : {{ book.section_name }}</p>
                    </div>
                    <div v-if='auth_token && role=="user"'>
                        <input type='date' v-model="resource.ret_date" :min="minDate" :max="maxDate" required style="width: 100%; margin-bottom: 10px;">
                        <button  @click="request_book(book.id)" class="btn btn-primary" style="width: 100%;">Request</button>
                    </div>
                    <div v-if='auth_token && role=="librarian"'>
                        <button  @click="editBook(book)" class="btn btn-primary" style="width: 100%;">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="editingBook" style="margin-top: 20px;">
      <h2>Edit Book</h2>
      <form @submit.prevent="updateBook">
        <div>
          <input type="text" v-model="editingBook.title" placeholder="Title">
        </div>
        <div>
          <input type="text" v-model="editingBook.author" placeholder="Author">
        </div>
        <div>
          <input type="text" v-model="editingBook.subtitle" placeholder="Subtitle">
        </div>
        <div>
          <input type="number" v-model="editingBook.sec_id" placeholder="Section ID">
        </div>
        <div>
          <textarea v-model="editingBook.content" rows="4" placeholder="Content"></textarea>
        </div>
        <div>
          <input type="text" v-model="editingBook.image" placeholder="Image URL">
        </div>
        <div>
          <input type="number" v-model="editingBook.year" placeholder="Publication Year">
        </div>
        <button type="submit">Update</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
</div>

    `,
    data(){
        return{
            all_books: [],
            auth_token : localStorage.getItem("auth_token"),
            role : localStorage.getItem("role"),
            email : localStorage.getItem("email"),
            selectedDate: '', 
            minDate: '', 
            maxDate: '' ,
            resource:{
                user_email : localStorage.getItem("email") ,
                book_id : '' ,
                ret_date : '',
            },
            editingBook:null ,
        }

    },
    created() {
        this.updateDateRange();
      },
    methods :{
        updateDateRange() {
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            const formatDate = (date) => date.toISOString().split('T')[0];
            this.minDate = formatDate(today);
            this.maxDate = formatDate(nextWeek);
        },
        async request_book(bid){
            this.resource.book_id = bid ;
            const res = await fetch('/api/book_request',{
                method : 'POST',
                headers:{
                    "Authentication-Token": this.auth_token ,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.resource),
            })
            const data = await res.json()
            if (res.ok){
                alert(data.message)
                this.$router.push({path: '/books'})
            }
            else{
                alert(data.message)
            }
        },
        async editBook(book){
            this.editingBook = { 
                book_id : book.id,
                title: book.title,
                author: book.author,
                subtitle: book.subtitle,
                sec_id: book.sec_id,
                content: book.content,
                image: book.image,
                year: book.year,
            };
        },
        async updateBook(){
            const res = await fetch('/api/edit_book',{
                method : 'POST',
                headers:{
                    "Authentication-Token": this.auth_token,
                    "Content-Type": `application/json`,
                },
                body: JSON.stringify(this.editingBook),
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                this.editingBook = null
                //this.fetchBooks()
                await this.fetchBook()
                
            }
            else{
                alert(data.message)
            }
        },
        cancelEdit() {
            this.editingBook = null; 
          },
          async fetchBook(){
            const res =  await fetch('/api/add_book' , {
                method: 'GET',
                headers: {
                    "Authentication-Token":this.auth_token,
                },
            })
            console.log(res)
            const data = await res.json()
            console.log(data)
            if(res.ok){
            this.all_books = data
            }
            else{
                alert(data.message)
            }
        },
    },
    
    async mounted(){
        const res =  await fetch('/api/add_book' , {
            method: 'GET',
            headers: {
                "Authentication-Token":this.auth_token,
            },
        })
        console.log(res)
        const data = await res.json()
        console.log(data)
        if(res.ok){
        this.all_books = data
        }
        else{
            alert(data.message)
        }
    },

}