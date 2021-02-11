<template>
<div class="contain">
    <div class="d-flex flex-row-reverse mb-3 mt-1">
        <button href="#" @click="createDialog()" class="btn btn-success text-white float-end"><icons i="plus-cicrcle"></icons> {{getLang('add-new-record')}}</button>
    </div>
     <!-- showing caption and search input -->
    <div class="d-flex justify-content-between mb-2 mt-2">
        <small class="align-bottom pt-3">Showing {{(current_page*items_per_page)-(items_per_page-1)}} - {{(current_page*items_per_page)>items.length ? showable_items.length : current_page*items_per_page}} of {{showable_items.length}} entries | {{current_page}} / {{pages}} pages</small>
        <div class="d-flex">
            <input class="form-control me-2" type="search" v-model="search_word" @keyup="doSearch" placeholder="Search..." aria-label="Search">
             <button @click="filtersDialog()" class="btn btn-info text-white tip"><icons i="filters"></icons><span>{{getLang('tooltip-filters')}}</span></button>
        </div>
    </div>
    <!--- TABLE (and Loading) -->
    <div v-if="loading" class="d-flex justify-content-center">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
    </div>
    <div v-else>
        <table class="table table-bordered table-hover table-responsive">
        <thead class="bg-light">
            <tr>
            <th v-for="(column_heading,column_key) in columns" :key="column_key" @click="sortFields(column_key)" 
                :class="[!sorting[column_key] ? 'sorting' : [sorting[column_key] === 'asc' ? 'sorting sorting-asc' : 'sorting sorting-desc']]">
               {{column_heading}}
            </th>
            <th v-if="OptionsColumn"></th>
            </tr>
        </thead>
            <tbody>
                    <tr v-for="(item,index) in page_items" :key="index">
                        <td v-for="(column_heading, column_key) in columns" :key="column_key">
                            <div v-if="Array.isArray(item[column_key])"> <!-- if table cell contains array we show it using unordered list -->
                                <ul class="table-data-list"> 
                                    <li v-for="(subitem, index) in item[column_key]" :key="index">{{subitem}}</li>
                                </ul>
                            </div>
                            <div v-else>
                            {{ column_key.toLowerCase() == 'id' ? item.num : item[column_key] }}
                            </div>
                        </td>
                        
                        <td v-if="OptionsColumn" class="options-buttons">   
                            <!-- Options --> 
                        <button v-if="ViewItemUri" class="btn btn-sm btn-white table-options tip" @click="viewItem(item.num - 1)"><icons i="eye-fill"></icons><span>{{getLang('tooltip-view')}}</span></button>

                        <button class="btn btn-sm btn-white table-options tip" @click="editDialog(item.id)"><icons i="pencil-square"></icons><span>{{getLang('tooltip-edit')}}</span></button>
                        
                        <button class="btn btn-sm btn-white table-options tip" @click="deleteDialog(item.id)"><icons i="trash"></icons><span>{{getLang('tooltip-delete')}}</span></button>
                            <!-- /  -->
                        </td>
                    </tr>
                 <tr v-if="page_items<1" class="text-center"><td :colspan="OptionsColumn ? Object.keys(columns).length + 1 : Object.keys(columns).length">No records have been found</td></tr>
            </tbody>
        

              <!-- Sum footer -->
              <tfoot v-if="SumColumns" id="summarize-footer" class="text-muted fw-bold text-end">
                <tr> 
                    <td v-for="(column_name,column_key) in columns" :key="column_key">
                        {{ SumColumns.indexOf(column_key)==0 ? summarizedColumns[column_key] : '' }}                
                    </td>
                </tr>
             </tfoot>
             <!-- /sum -->
        </table>
     </div>
     <nav class="float-end">
       <ul class="pagination pagination-sm">
         <li class="page-item">
           <button class="page-link" @click="current_page = 1">{{getLang('page-first')}}</button>
         </li> 
         <li class="page-item">
           <button class="page-link" @click="current_page > 1 ? current_page-- : current_page = 1" aria-label="Previous">
             <span aria-hidden="true">{{getLang('page-previous')}}</span>
           </button>
         </li>  
              
         <li v-for="(page, index) in pages" :key="index" :class="[current_page===page ? 'page-item active' : 'page-item']">
             <button v-if="page > (current_page-5) && page < (current_page+5) " class="page-link" @click="[current_page = page]">{{page}}</button>
        </li>
         
         <li class="page-item">
           <button class="page-link" @click="current_page < pages ? current_page++ : current_page = pages" aria-label="Next">
             <span aria-hidden="true">{{getLang('page-next')}}</span>
           </button>
         </li>
        
        <li class="page-item">
           <button class="page-link" @click="current_page = pages">{{getLang('page-last')}}</button>
         </li> 


       </ul>
     </nav>
     
     <!-- DIALOGS --->
    <edit-dialog :selected-item="selected_item" 
                 :edit-fields="EditFields" 
                 @item-updated="onItemUpdated"
                 @item-stored="onItemStored"               
                 :base-uri="BaseUri"
                 :dialog-state="dialogState"
                 ></edit-dialog>
    
    <delete-dialog :selected-item="selected_item"
                    @item-deleted="onItemDeleted"
                   :base-uri="BaseUri"></delete-dialog>

   <filters-dialog :columns="columns"
                   :filter-columns="FilterColumns" 
                   :items="items" 
                   :edit-fields="EditFields"
                    @items-filtered="onItemsFiltered"
                   ></filters-dialog> 
    <!-- / dialogs -->
</div>
</template>
<script>

import axios from 'axios';

import { Modal } from 'bootstrap';

import './vesselind-datatables.css';

import EditDialog from './dialogs/EditDialog';
import DeleteDialog from './dialogs/DeleteDialog';
import FiltersDialog from './dialogs/FiltersDialog';
import Icons from './Icons';

import lang from './lang.js'

export default {
    name: 'VdVueDatatables', // vue component name
    components:{
        EditDialog,
        DeleteDialog,
        FiltersDialog,
        Icons
    },
    props:{
        columns: Object,
        FilterColumns: Object,
        BaseUri: String,
        EditUri: String,
        ViewItemUri: String,
        CreateUri: String,
        EditStatic: Boolean,
        EditFields: Array,
        OptionsColumn: Boolean,
        SumColumns: Array,
       
    },
    data(){
        return{
            items_per_page: 20,           
            search_word: null,
            
            items:[],
            showable_items: [],
            filtered_items: [], //these are only items that are filtered by using filter dialog, not search input
            page_items: [],

            loading: false,

            sorting: {},

            pages: null,
            current_page: 1,
            selected_item: {},

            createModal: '',
            editModal: '',
            deleteModal: '',
            dialogState: '',  //should be edit or create

            summarizedColumns: {}, //sums on numeric columns

            toastr: (toastr.options = {
                positionClass: "toast-top-center",
                closeButton: true,
            }),

        }
    },
    methods:{

        doSearch(){    
           if (this.search_word){
                var toSearch = this.search_word.toLowerCase();
                var objects; 
                    if (this.filtered_items && this.filtered_items.length>0) {
                        objects = [...this.filtered_items]; //!!!
                    }else{
                    
                        objects = [...this.items];
                    }
                var searchable_fields = Object.keys(this.columns);
                var results = [];

                    for (var i = 0; i < objects.length; i++) {
                        for (let key in searchable_fields) {
                        var field = searchable_fields[key];
                        if (
                            objects[i][field] &&
                            objects[i][field].toString().toLowerCase().indexOf(toSearch) != -1
                        ) {
                            results.push(objects[i]);
                            break;
                        }
                        }
                    }
                    this.showable_items = [];
                    this.showable_items = results;
                    this.current_page = 1;
           }
        },

        loadItems(){
          this.loading = true;
          
          axios.get(this.BaseUri)
           .then((response)=>{
               //console.log(response.data.data);
               console.info('<< Datatables - Data loading. >>')
                this.items = response.data.data;
                
                //adding a number to every item, which is shown in id column instead of showing database id 
                for (const key of Object.keys(this.items)){
                    this.items[key]['num'] = parseInt(key)+1;
                }                

           }).catch((error)=>{
               this.showToastErrors(error.response.status, error.response.data.message);

           })
            .finally(()=>{ this.loading = false; });
        },

        showToastErrors(status, message){
            if (status==500){
                toastr.error(message, 'Error 500');
            }
            else if (status == 404){
                toastr.error('Server address not found', 'Error 404');
            }else if (status = 422){
                toastr.warning('Unproccesible entry', 'Error 422'); //validation error
            }
        },

        /***** CRUD ****/

        //showing new item dialog
        createDialog(){
            if (this.CreateUri){
                window.location.href = this.CreateUri;
            }else{
                this.selected_item = {};
                this.dialogState = 'create';
                this.createModal = new Modal(document.getElementById('edit-modal'), { backdrop: 'static'});
                this.createModal.show();
            }
        },

        onItemStored(item){
            console.log('<< Datatables - stored item >>');
            
            this.loadItems();
        },

        //showing edit dialog /editdialog subcomponent/
        editDialog(id){
            //if EditUri prop is not empty - locate to url, otherwise - show modal dialog
            var index = this.items.findIndex((element)=> element.id == id);

            if (this.EditUri){
                let locationUri = this.EditUri.replace(':id', this.items[index].id);
                window.location.href = locationUri;
            }else{
                this.dialogState = 'edit';
                this.selected_item = {...this.items[index]};
                this.selected_item['index'] = index;
                this.editModal = new Modal(document.getElementById('edit-modal'), { backdrop: 'static'});
                this.editModal.show();
            }
        },

    
        onItemUpdated(item){
               
            this.items[item.index] = item;
            this.slicePage();
        },
 
        //showing delete dialog
        deleteDialog(id){
            var index = this.items.findIndex((element)=> element.id == id);
            this.selected_item = {...this.items[index]};
            this.selected_item['index'] = index;
            //this.current_item_id = this.items[index].id;
            this.deleteModal = new Modal(document.getElementById('delete-modal'));
            this.deleteModal.show();
        },

        onItemDeleted(item){
             this.$delete(this.items, item.index);   
        },

        viewItem(index){
            if (this.ViewItemUri){
                let locationUri = this.ViewItemUri.replace(':id', this.items[index].id);
                window.location.href = locationUri;
            }
        },

         //showing filters
        filtersDialog(){
            this.filtersModal = new Modal(document.getElementById('filters-modal'), { backdrop: 'static'});
            this.filtersModal.show();
            
        },

        onItemsFiltered(results){
            this.showable_items = results;
            this.filtered_items = results;
            this.current_page = 1;
        },



        /*** Manipulating data */
        sortFields(field) {
          
            this.sorting[field] = this.sorting[field] === "asc" ? "desc" : "asc";
          
            this.showable_items.sort((a, b)=>{
                
                let firstEl;
                let secondEl;

                //if element is array will sort on its first element
                firstEl  = typeof(a[field])=='object' ? a[field][0] : a[field];
                secondEl = typeof(b[field])=='object' ? b[field][0] : b[field];
                
                if (isNaN(Number(firstEl))){ //if converting to number results in NaN, then we have a string
                    if (this.sorting[field] === 'asc'){
                        return firstEl.toLowerCase() > secondEl.toLowerCase() ? 1 : -1;
                    }else{
                       return firstEl.toLowerCase() < secondEl.toLowerCase() ? 1 : -1;
                    }
                    
                }else{ //otherwise we have a number; empty fields are equal to 0
                    if (this.sorting[field] === 'asc'){
                        return firstEl - secondEl;// ? 1 : -1;
                    }else{
                        return secondEl - firstEl;//Number(firstEl) < Number(secondEl) ? 1 : -1;
                    }
                }
                
            });
            /** Delete sorting options for all the other columns except the current one
             *  This way we will remove styling on inactive headings
             */
            for (var k in this.sorting) {
                if (this.sorting.hasOwnProperty(k) && k != field) {
                    delete this.sorting[k];
                }
            }

            this.current_page = 1;
        },

        summarizeColumns(){
        
            let arr = this.page_items;
            let sum_page_items;
            let sum_all_items;
            for (const column of this.SumColumns){
                
                sum_page_items = this.page_items.reduce(function (a, b) {
                    return Number(a) + Number(b[column]);
                },0);
                
                sum_all_items = this.items.reduce(function (a, b) {
                    return Number(a) + Number(b[column]);
                },0);

               
                var localization = 'bg-BG';

                this.summarizedColumns[column] = sum_page_items.toLocaleString(localization) + ' (' + sum_all_items.toLocaleString(localization) + ' total)';
            }            
        },

        slicePage(){  //slicing showable items on changing page or calculating pages

                this.pages = Math.ceil(this.showable_items.length / this.items_per_page);

                var start = this.items_per_page * (this.current_page - 1);
                var end = this.items_per_page * this.current_page;
                this.page_items = this.showable_items.slice(start,end);
        },


        getLang(caption){
            return lang(caption);
        }
        
    },

    watch:{
        items(){ //on changing items

            
            this.showable_items = this.items;
            this.slicePage();
      
            if (this.SumColumns) {
                this.summarizeColumns();
            }

        },

        showable_items(){
            this.slicePage();

            if (this.SumColumns) {
                this.summarizeColumns();
            }

        },

        current_page(){ //changing current page var
            this.slicePage(); 
            
            if (this.SumColumns) {
                this.summarizeColumns();
            }
        }

    },

    created(){
        this.loading = true;
    },

    mounted(){
       this.loadItems();
    }
}
</script>
<style scoped>

</style>