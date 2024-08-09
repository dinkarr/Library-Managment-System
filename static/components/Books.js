export default{
    template:`
<div style="margin: 2%;">
    <input v-model="searchQuery" placeholder="Search by title, author, or genre" style="width: 100%; padding: 8px; margin-bottom: 20px;">
    <div>
        <div v-if="filteredBooks.length" class="row">
            <div v-for="book in filteredBooks" :key="book.id" class="col-md-3 mb-3">
                <div class="card" style="padding: 0; width: 100%; height: 100%;">
                    <img :src="book.image" class="card-img-top" :alt="book.title" style="width: 100%; height: auto; aspect-ratio: 3 / 4;">
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
                            <button  @click="editBook(book)" class="btn btn-primary" style="width: 80%;">Edit</button>
                            
                            <button  @click="delete_book(book.id)" class="btn btn-danger" style="width: 80%;">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No books found</p>
        </div>
    </div>
    



    <div v-if="editingBook" style="margin-top: 20px; font-family: Arial, sans-serif;">
  <h2 style="margin-bottom: 15px;">Edit Book</h2>
  <form @submit.prevent="updateBook" style="display: flex; flex-direction: column; gap: 10px; max-width: 400px;">
    <input type="text" v-model="editingBook.title" placeholder="Title" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;">
    <input type="text" v-model="editingBook.author" placeholder="Author" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;">
    <input type="text" v-model="editingBook.subtitle" placeholder="Subtitle" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;">
    <input type="number" v-model="editingBook.sec_id" placeholder="Section ID" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;">
    <textarea v-model="editingBook.content" rows="4" placeholder="Content" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;"></textarea>
    <input type="text" v-model="editingBook.image" placeholder="Image URL" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;">
    <input type="number" v-model="editingBook.year" placeholder="Publication Year" style="padding: 8px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;">
    <button type="submit" style="padding: 10px; font-size: 16px; color: #fff; background-color: #007bff; border: none; border-radius: 4px; cursor: pointer;">Update</button>
    <button type="button" @click="cancelEdit" style="padding: 10px; font-size: 16px; color: #fff; background-color: #6c757d; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
  </form>
    </div>

</div>

    `,
    data(){
        return{
            all_books: [],
            searchQuery: '' ,
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
            delete_resource:{
                book_id : null,
            },
        }

    },
    created() {
        this.updateDateRange();
    },
    computed: {
        filteredBooks() {
          if (!this.searchQuery) {
            return this.all_books;
            }
            const query = this.searchQuery.toLowerCase();
            return this.all_books.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            (book.section_name && book.section_name.toLowerCase().includes(query))
          );
        }
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
                content: book.content,
                sec_id: book.section_id ,
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
            const data = await res.json()
            if(res.ok){
            this.all_books = data
            // await this.fetchBook()
            }
            else{
                alert(data.message)
            }
        },

        async delete_book(bid){
            this.delete_resource.book_id = bid ;
            const res = await fetch('/api/delete_book',{
                method : 'POST',
                headers:{
                    "Authentication-Token": this.auth_token ,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.delete_resource),
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
        const res =  await fetch('/api/add_book' , {
            method: 'GET',
            headers: {
                "Authentication-Token":this.auth_token,
            },
        })
        const data = await res.json()
        if(res.ok){
        this.all_books = data
        }
        else{
            alert(data.message)
        }
    },

}