<template>
<div>
<!-- Edit modal -->
<div class="modal fade" id="edit-modal" tabindex="-1" data-bs-backdrop="static" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 v-if="DialogState=='edit'" class="modal-title">{{$parent.getLang('edit-modal-title')}}</h5>
        <h5 v-else class="modal-title">{{$parent.getLang('create-modal-title')}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

          <div class="mb-2" v-for="(field, i) in EditFields" :key="i">
            <!-- input -->
            <div v-if="field.type == 'input'" class="mb-2">
                <label class="form-label" :for="'form-element-' + i">{{field.label}}</label>
                <input v-model="SelectedItem[field.name]" :id="'form-element-' + i" :class="'form-control ' + [errors[field.name] ? 'is-invalid' : '']" type="text" name="name"/>
            
                <div class="invalid-feedback">
                  <span v-for="(errorText,i) in errors[field.name]" :key="i">{{ errorText }}</span>
                </div>
            </div>


            <div v-if="field.type == 'input-number'" class="mb-2">
                <label class="form-label" :for="'form-element-' + i">{{field.label}}</label>
                <input v-model="SelectedItem[field.name]" :id="'form-element-' + i" :class="'form-control ' + [errors[field.name] ? 'is-invalid' : '']" type="number" name="name"/>
            
                <div class="invalid-feedback">
                  <span v-for="(errorText,i) in errors[field.name]" :key="i">{{ errorText }}</span>
                </div>
            </div>

             <!-- select (vue-select) -->
            <div v-if="field.type == 'select'" class="mb-2">
              <label class="form-label" :for="'form-element-' + i">{{field.label}}</label>
               <!-- using vue-select -->
               <v-select :id="'form-element-' + i" v-model="SelectedItem[field.name]" :options="LoadedOptions[field.name]" />
              <small v-for="(errorText,i) in errors[field.name]" :key="i" style="color: red">{{ errorText }}</small>
            </div>

            <!-- multiple-select (vue-select) -->
            <div v-if="field.type == 'multiple-select'" class="mb-2">
              <label class="form-label" :for="'form-element-' + i">{{field.label}}</label>
               <!-- using vue-select -->
               <v-select multiple v-model="SelectedItem[field.name]" :options="LoadedOptions[field.name]" :taggable="field.taggable" />
              <small v-for="(errorText,i) in errors[field.name]" :key="i" style="color: red">{{ errorText }}</small>
            </div>        

             <!-- textarea -->
             <div v-if="field.type == 'textarea'" class="mb-2">
                <label :for="'form-element-' + i" class="form-label">{{field.label}}</label>
                <textarea :class="'form-control ' + [errors[field.name] ? 'is-invalid' : '']" v-model="SelectedItem[field.name]" :id="'form-element-' + i" rows="3"></textarea>
                <div class="invalid-feedback">
                  <span v-for="(errorText,i) in errors[field.name]" :key="i">{{ errorText }}</span>
                </div>
            </div>

          </div>


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="onCloseModal">{{$parent.getLang('close-button')}}</button>
        <button v-if="DialogState=='edit'" type="button" class="btn btn-primary" @click="update">{{$parent.getLang('save-changes-button')}}</button>
        <button v-else type="button" class="btn btn-primary" @click="store">{{$parent.getLang('create-record-button')}}</button>
      </div>
    </div>
  </div>
</div>

</div>
</template>
<script>


import vSelect from 'vue-select'

export default {
    components:{
      vSelect
    },
    props:{
      SelectedItem: Object,
      EditFields: Array,
      BaseUri: String,
      DialogState: String
    },

    data(){
      return{
          LoadedOptions: {},
          vselected: { value: '', multiple:[]},
          
          update_item: {},
          errors: [],

          taggable: true,

          toastr: (toastr.options = {
            positionClass: "toast-top-center",
            closeButton: true,
          }),
          
      }
    },
    
    methods:{

        prepareSendingData(){
             var sendingData={};
             for (const field of this.EditFields){     
               
                 //check if field is select option
                if (field.type === 'select') {
                  //this.SelectedItem[field.name] = !this.vselected.value ? '' : this.vselected.value;
                  //sendingData[field.name] = !this.vselected.value ? '' : this.vselected.value;
                  sendingData[field.name] = this.SelectedItem[field.name];    
                }
                else if(field.type == 'multiple-select'){
                  //this.SelectedItem[field.name] = !this.vselected.multiple ? '' : this.vselected.multiple;
                  //sendingData[field.name] = !this.vselected.multiple ? '' : this.vselected.multiple;

                  sendingData[field.name] = this.SelectedItem[field.name];    
                }else{
                  sendingData[field.name] = this.SelectedItem[field.name];             
                } 
             }

            this.vselected.value = '';
            this.vselected.multiple = [];
            return sendingData;
        },

        store(){
              this.errors = []; 
              var sendingData = this.prepareSendingData();

              axios.post(this.BaseUri + "/", sendingData)
              .then((response) => {
                this.$parent.createModal.hide();
                /* TOASTR */
                toastr.success(response.data.message);
                this.$emit('item-stored', response.data.data);

              })
              .catch((error) => {  
                 this.$parent.showToastErrors(error.response.status, error.response.data.message);

                 if (error.response.status == 422){  //validation error
                        this.errors = error.response.data.errors;
                 } 

              })
              .finally(() => {
               // this.loading = false;
              });

        },
        update(){
              this.errors = [];  
              var sendingData = this.prepareSendingData();
              console.log(sendingData);
      
              axios.patch(this.BaseUri + "/" + this.SelectedItem.id, sendingData )
                .then((response) => {
                 this.$parent.editModal.hide();

                /* TOASTR */
                toastr.success(response.data.message);
                this.$emit('item-updated', this.SelectedItem);
                
               
                }) 
                .catch((error) => {             
                    this.$parent.showToastErrors(error.response.status, error.response.data.message);

                    if (error.response.status == 422){  //validation error
                        this.errors = error.response.data.errors;
                    } 
                }); 
        },

        loadSelectOptionsFromSource(){     
          let promises = [];
          let results = [];
          let resp = [];
          var i;
          for (const field of this.EditFields){
            i++;
              if (field.type=='select' || field.type=='multiple-select'){
                //console.log(this.EditFields);
                //console.log(field);

                
                  axios.get(field.options_source).then((response)=>{
                      //console.log(this.EditFields);
                    //   console.log(field);
                      
                      //results.push({[field.name] : response.data});
                      this.LoadedOptions[field.name] = response.data;     
                  }) 
                

              }
          }

         console.log(resp[i]);
        },
        
        onCloseModal(){
           this.errors = [];
        }
    },

    mounted(){

     this.loadSelectOptionsFromSource();
    }

}
</script>