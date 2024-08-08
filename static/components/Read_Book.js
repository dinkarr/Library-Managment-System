export default{
    template:`
    <div v-if="book" style="padding: 20px; border: 1px solid #ddd; border-radius: 4px;">
    <h2>{{ book.book_name }}</h2>
    <p><strong>Author:</strong> {{ book.author }}</p>
    <p><strong>Content:</strong></p>
    <div v-html="book.book_content"></div>
    <button @click="$emit('close')" class="btn btn-secondary">Close</button>
    </div>

    `,

    props: ['book']
}


