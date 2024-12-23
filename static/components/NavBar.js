export default{
    template:`
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" >LMS</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="is_loged_in">
              <router-link class="nav-link active" aria-current="page" to="/home">Home</router-link>
            </li>
            <li class="nav-item" v-if="is_loged_in">
              <router-link class="nav-link active" to="/books">Books</router-link>
            </li>
            
            <li class="nav-item" v-if="is_loged_in && role === 'user'">
              <router-link class="nav-link active" to="/user_profile">User Profile</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link active" v-if="!is_loged_in" to="/signup">Signup</router-link>
            </li>
            
            <li class="nav-item" v-if='role=="librarian"'>
              <router-link class="nav-link active" to="/users">User Info</router-link>
            </li>
            <li class="nav-item" v-if='role=="librarian"'>
              <router-link class="nav-link active" to="/addbook">Add Book</router-link>
            </li>
            <li class="nav-item "  v-if="is_loged_in && role === 'librarian'" >
              <router-link class="nav-link active" to="/sections">Sections</router-link>
            </li>
            <li class="nav-item "  v-if="is_loged_in && role === 'librarian'" >
              <router-link class="nav-link active" to="/stats">Statistics</router-link>
            </li>
            <li class="nav-item active" v-if="is_loged_in">
              <button class="nav-link active" @click="logout">Logout</button>
            </li>
          
            
          </ul>
         
          
        </div>
      </div>
    </nav>
    `,

  data(){
    return{
      role:localStorage.getItem('role'),
      is_loged_in:localStorage.getItem('auth_token'),
      email:localStorage.getItem('email')
    }
  },
  methods:{
    logout(){
      localStorage.removeItem('auth_token')
      localStorage.removeItem('role')
      localStorage.removeItem('email')
      this.$router.push({path:'/'})
    },
  },


    
}