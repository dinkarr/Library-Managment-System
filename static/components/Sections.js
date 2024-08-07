export default{
    template:`
      <div>
      <br>
        <div :style="containerStyle">
            <div style="text-align: center; margin-bottom: 15px;">
                <h6 style="margin-bottom: 10px;">Existing Sections</h6>
                <hr style="border: 1px solid #ddd; width: 60%; margin: 0 auto;">
            </div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Section Id</th>
                <th scope="col">Section Name</th>
                <th scope="col">Edit Section</th>
                <th scope="col">Delete Section</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(section, index) in all_sections" :key="index">
                <td>{{ section.section_id }}</td>
                <td>{{ section.section_name }}</td>
                <td><button class="btn btn-primary" @click="toggleEdit">{{ isEditing ? 'Cancel' : 'Edit' }}</button>
                <div v-if="isEditing">
                    <input type="text" id="editInput" v-model="edit_section_resource.section_name">
                    <button  class="btn btn-primary" @click="edit_section(section.section_id)">Save</button>
                </div>
                </td>
                <td><button  class="btn btn-danger" @click="delete_section(section.section_id)">Delete</button></td>
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        <br>
        <br>
        <div :style="containerStyle">
            <div style="text-align: center; margin-bottom: 15px;">
                <h6 style="margin-bottom: 10px;">Add Sections</h6>
                <hr style="border: 1px solid #ddd; width: 60%; margin: 0 auto;">
            </div>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Type Section Name</th>
                <th scope="col">Clisk to add</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td><input type="text" v-model="add_section_resource.section_name"></td>
                <td><button  class="btn btn-primary" @click="add_section">Add</button></td>
                </tr>
            </tbody>
            </table>
        </div>
    </div>

    
    `,

    data(){
        return{
            all_sections:[],
            auth_token: localStorage.getItem("auth_token"),
            role: localStorage.getItem("role"),
            isEditing: false, // Track whether the input field is visible 
            containerStyle: {
                width: '88%',
                margin: '0 auto',
                border: '1px solid #ddd', 
                padding: '10px',
              },
            edit_section_resource:{
                section_name : null,
                section_id : null,
            },
            delete_section_resource:{
                section_id : null,
            },
            add_section_resource : {
                section_name : null,
            },
        }
    },
    methods:{
        toggleEdit() {
            this.isEditing = !this.isEditing;
          } ,

        async get_sections(){
            const res = await fetch('/api/add_section',{
                method:'GET',
                headers:{
                    "Authentication-Token": this.auth_token
                }
            })
            const data = await res.json()
            if(res.ok){
                this.all_sections = data
            }
            else{
                alert(data.message)
            }
        },

        async add_section(){
            const res = await fetch('/api/add_section',{
                method:'POST',
                headers:{
                    "Authentication-Token": this.auth_token,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.add_section_resource)
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                this.add_section_resource.section_name = null ;
                await this.get_sections()
            }
            else{
                alert(data.message)
            }
        },

        async edit_section(sec_id){
            this.edit_section_resource.section_id = sec_id 
            const res = await fetch('/api/edit_section',{
                method : 'POST',
                headers:{
                    "Authentication-Token": this.auth_token ,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.edit_section_resource)
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                await this.get_sections()
                this.isEditing = false;
            }
            else{
                alert(data.message)
            }
        },
        async delete_section(sec_id){
            this.delete_section_resource.section_id = sec_id 
            const res = await fetch('/api/delete_section',{
                method : 'POST',
                headers:{
                    "Authentication-Token": this.auth_token ,
                    "Content-Type":`application/json`,
                },
                body : JSON.stringify(this.delete_section_resource)
            })
            const data = await res.json()
            if(res.ok){
                alert(data.message)
                await this.get_sections()
            }
            else{
                alert(data.message)
            }
        },

    },
    async mounted(){
        this.get_sections() ;
    },
}