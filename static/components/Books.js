export default{
    template:`
    <div style="margin: 2%;">
        <div v-if="all_books && all_books.length" class="row">
            <div v-for="book in all_books" :key="book.id" class="col-md-3 mb-3">
                <div class="card p-3">
                    <img :src="book.image" class="card-img-top" :alt="book.title" style="height: auto;">
                    <div class="card-body">
                        <h5 class="card-title">{{ book.title }}</h5>
                        <p class="card-text"><strong>Author:</strong> {{ book.author }}</p>
                        <p class="card-text"><strong>Subtitle:</strong> {{ book.subtitle }}</p>
                        <p class="card-text"><strong>Section:</strong> {{ book.section_name }}</p>
                        <input type='date' id="dateInput" v-model="selectedDate" :min="minDate" :max="maxDate">
                        <a href="/request" class="btn btn-primary">Request</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return{
            all_books: [],
            auth_token : localStorage.getItem("auth_token"),
            role : localStorage.getItem("role"),
            selectedDate: '', 
            minDate: '', 
            maxDate: '' 
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