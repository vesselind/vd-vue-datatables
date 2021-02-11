<template>
<div>
<!-- Edit modal -->
<div class="modal fade" id="filters-modal" tabindex="-1" data-bs-backdrop="static" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{$parent.getLang('filters')}}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

          <div class="mb-2" v-for="(type, key) in FilterColumns" :key="key">
        
             <!-- input -->
           
            <div v-if="type== 'number'" class="mb-2 custom-control-inline">
                <div class="row g-3">
                   <label class="form-label" :for="'form-element-' + key">{{columns[key]}}</label>
                    <div class="col-sm-2" style="margin-top: 0px;">
                      
                        <select v-model="numbersOperator[key]" class="form-control">
                          <option value=""> </option>
                          <option value="="> = </option>
                          <option value=">"> > </option>
                          <option value="<"> < </option>
                          <option value="!=">!=</option>
                        </select>
                    </div>
                    <div class="col" style="margin-top: 0px;">
                
                         <input v-model="selectedItem[key]" :id="'form-element-' + key" class="form-control" type="number" name="name"/>
                    </div>
                </div>
            </div>
         

             <!-- select (vue-select) -->
            <div v-if="type == 'input'" class="mb-2">
              <label class="form-label" :for="'form-element-' + key">{{columns[key]}}</label>
               <!-- using vue-select -->
               <v-select :id="'form-element-' + key" v-model="selectedItem[key]" :options="filterOptions[key]" />    
            </div>

        
           

          </div>


      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{$parent.getLang('close-button')}}</button>
        <button type="button" class="btn btn-danger" @click="clearFilters()">{{$parent.getLang('clear-filters')}}</button>
        <button type="button" class="btn btn-primary"  @click="filterIt()">{{$parent.getLang('apply-filters')}}</button>
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
      columns: Object,
      FilterColumns: Object,
      items:Array,
      EditFields: Array,
    },

    data(){
      return{
          selectedItem: {},

          numbersOperator: {},
          
          filteredOptions: []
         
          
      }
    },
    
    methods:{
      	filterIt(){
          //var currentColumn = 'body';
          var searchWord;
          var searchNum;
         

          var results = [];

          if (this.selectedItem){

                results = this.items;

                for (const currentColumn in this.FilterColumns){
                  if (this.FilterColumns[currentColumn]==="input"){
                      searchWord=  this.selectedItem[currentColumn] ? this.selectedItem[currentColumn].trim().toLowerCase() : '';
                      results = results.filter((item)=>{              
                        
                          return item[currentColumn] && item[currentColumn].toString().toLowerCase().indexOf(searchWord) != -1;
                      });
                  }else if(this.FilterColumns[currentColumn]==='number'){
                      searchNum = Number(this.selectedItem[currentColumn]);
                      results = results.filter((item)=>{
                          var switchRes;
                          switch(this.numbersOperator[currentColumn]) {
                            case '=':
                              switchRes = item[currentColumn] && Number(item[currentColumn]) == searchNum;
                              break;
                            case ">":
                              switchRes = item[currentColumn] && Number(item[currentColumn]) > searchNum;
                              break;
                            case "<":
                              switchRes = item[currentColumn] && Number(item[currentColumn]) < searchNum;
                              break;
                            case "!=":
                              switchRes = item[currentColumn] && Number(item[currentColumn]) != searchNum;
                              break;
                            default:
                              switchRes = true;
                          }
                          return switchRes;
                      });
                  }
                }
            this.$parent.filtersModal.hide();
            this.$emit('items-filtered', results);
          }
        },

        clearFilters(){
              this.numbersOperator = {};
              this.selectedItem = {};
              this.$parent.filtersModal.hide();
              this.filterIt();
        },


         getFilterOptionsOnColumn(currentColumn){
              var options =[];

                for (const item of this.items){
                  //if array element is array again - push its elements to the main newItems array        
                  if (Array.isArray(item[currentColumn])){
                      for (const el of item[currentColumn]){
                          //add only unique records
                            if (options.indexOf(el)<0){ 
                              options.push(el);
                            }
                      }
                  }else{
                      //add only unique records
                      if (options.indexOf(item[currentColumn])<0){ 
                        options.push(item[currentColumn]);
                      }
                  }
                }
              return options;
         }
       
    },



    mounted(){
       
    },

    computed:{
       filterOptions(){
          var options = [];
          
          for (const column in this.FilterColumns){
             options[column] = this.getFilterOptionsOnColumn(column);
          }
          return options;

      }
     
    },


}
</script>