import VdVueDatatables from './vd-vue-datatables.vue'

export default VdVueDatatables;

window.toastr = require('toastr');

try {
    window.Popper = require('@popperjs/core').default;
    //window.$ = window.jQuery = require('jquery');

    require('bootstrap');
} catch (e) {}


window.axios = require('axios');

//window.$ = window.jQuery = require('jquery');

require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('vue-select/dist/vue-select.css');

window._ = require('lodash');


//window.axios = require('axios');
