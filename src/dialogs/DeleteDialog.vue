<template>
    <!-- DELETE modal -->
<div class="modal fade" id="delete-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Delete</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- Delete qustion text -->
          {{$parent.getLang('delete-question')}}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{$parent.getLang('delete-cancel')}}</button>
        <button type="button" class="btn btn-danger" @click="destroyItem">{{$parent.getLang('delete-confirm')}}</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
    props:{
        BaseUri:String,
        SelectedItem:Object
    },
   methods:{
        destroyItem() {
            console.log(this.BaseUri + "/" + this.SelectedItem.id);
                axios.delete(this.BaseUri + "/" + this.SelectedItem.id)
                .then((response) => {
                    //this.$delete(this.items, index);
                    console.log(response.data.task);
                    
                    this.$parent.deleteModal.hide();
                    this.$emit('item-deleted', this.SelectedItem);

                    toastr.warning(response.data.message);


                })
                .catch((error) => {
                    toastr.error(error.response.data.message, error.response.status);
                }); 
            
        }
   } 
}
</script>
