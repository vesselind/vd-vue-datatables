# Vd Vue Datatables Beta

## About

Vd-Vue-Datatables is a data table component like jQuery datatables for Vue 2 and Bootstrap 5. It provides CRUD functionality using Bootstrap 5 modals for editing and creating new records and has some more features like:

- Searching input field on the top of the table to search for a string in all the columns in your table
- Filters options for searching only in selected column and numeric range searching
- Sorting columns
- Summarizing columns with numeric values
- Toastr notifications on updating/creating/deleting data. 

The component works with client-side pagination only. Therefore, it is not recommended to use the component with more than 4-5 thousand rows of data.



## Installation

Install with npm:

```
npm i vd-vue-datatables
```

Then import the component (locally in your vue component):

```js
import VdVueDatatables from 'vd-vue-datatables'
export default {
  components: {
    VdVueDatatables
  },
```

Or you can register it globally

```js
import VdVueDatatables from 'vd-vue-datatables'
Vue.component('vd-vue-datatables', VdVueDatatable).default);
```



## Usage

You can use the component with the following props:

```html
      <vd-vue-datatables 
            :columns="{'id':'No','name':'Personal Name','description':'Personal Description', 'interests':'Personal Interests', 'income':'Income', 'created_at_humans': 'Date'}" 
            :filter-columns = "{'name':'input', 'interests':'input', 'income':'number'}"
            
            base-uri="https://vesselind.github.io/vd-vue-datatables/fake_data.json"  
            edit-uri="items/:id"
            view-item-uri: "items/:id"
            :edit-fields="[
                  {'name':'name', 'label': 'Personal name', 'type':'input'},
                  {'name':'description', 'label': 'Description', 'type':'textarea'},
                  {'name':'interests', 'label': 'Personal interests:', 'type':'multiple-select', 'options_source':'https://vesselind.github.io/vd-vue-datatables/interests_dropdown.json', taggable:true},
                  {'name':'income', 'label': 'Income', 'type': 'input-number' },
            ]"

            :options-column="true"
            :sum-columns="['income']"
            >
    </vd-vue-datatables>
```

The example above is working with this sample json data: https://vesselind.github.io/vd-vue-datatables/fake_data.json

You also can see the sample json dropdown options (for the *interests* column): https://vesselind.github.io/vd-vue-datatables/interests_dropdown.json

### Props Explanation

| Prop           | Example value                                                | Type   | Description                                                  |
| -------------- | ------------------------------------------------------------ | ------ | ------------------------------------------------------------ |
| columns        | :columns = {'name':'Personal Name','description':'Personal Description'} | Object | **Required**. The properties of the object represents your column name and it has to correspond to the column name in your JSON data. The value is the label of your column which will be shown on the heading of the table in <th> element. Exception is the **id** key. The column with **id** key will not get the **id** value from json data provided but will show just the consequent number of the row instead. |
| filter-columns | :filter-columns ="{'name':'input', 'interests':'**input**', 'income':'**number**'}" | Object | **Optional**. It is used by filtering feature. The keys  (properties) of the object are the columns names according to your JSON data. Values of this object can be ***number* or *input* only.** Set number value when your column contains **numeric** data and **input** value in any other case**.** |
| base-uri       |                                                              | String | **Required.** Sets the URL to the json data source. Here could be the RESTful API URL. If you are using client-side CRUD feature you should take into account that your base-uri will be used for store, delete and update operations. For these operations AXIOS and HTTP sending data methods are used. See the the explanation below: |

If base_uri is '**home/items**', then URL of updating, storing and delete data will be like:

| URI                 | Action               | HTTP Method |
| ------------------- | -------------------- | ----------- |
| home/items          | **index (base_uri)** | GET         |
| home/items/**{id}** | update               | PATCH       |
| home/items          | store                | POST        |
| home/items/**{id}** | delete               | DELETE      |

| Prop           | Example value | Type    | Description                                                  |
| -------------- | ------------- | ------- | ------------------------------------------------------------ |
| view-item-uri  | items/:id     | String  | **Optional.** Sets the static URL of your view page for the table record. If you do not have view page or do not want to locate to it, then you skip that prop. Skipping that prop will result in disappearing of view icon in options column.  The :id will be replaced automatically by the **id** provided in your json data. |
| options-column | true or false | Boolean | **Optional.** Enables or disables the options column appearing on the rightmost part of the table. Options column provides view, edit and delete buttons for every single record. |
| sum-columns    | ['income']    | Array   | **Optional.** Sets the columns which values you want to sum up in the footer of the table. Every single value of array is the column name. It works only with columns, containing numbers. Names of the columns in the array should be equivalent to the names you have chosen in ":columns" prop and in your json data. |



### Edit-fields Prop

Edit-fields prop is used to define the fields in your edit/create form. It is necessary to be defined only if you plan to use the RESTful CRUD functionality and the bootstrap modal dialogs. 

The prop accepts **array of objects**. Every row of the array is object that represents a single field in your edit or create form. Properties of the objects are: **"name"** - value of which is the name of your column; **label** - its value will be shown in <label> tag of the edit/create form; and **type.**

**Type** property sets the type of you html input element in your edit/create form. You can choose from the following values: 

| Type            | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| input           | It is equivalent to <input> html element.                    |
| textarea        | It is equivalent to <textarea> html element.                 |
| select          | Integrates **vue-select** dropdown options - only one selection from the dropdown is possible. |
| multiple-select | Integrates **vue-select** dropdown options - many selections from the dropdown ins possible. |

**Both select and multiple-select** have additional attributes: **'options_source'** and '**taggable**'. Options_source accepts a **string** value - URL to json array of dropdown options. See the link above. 

Taggable sets a taggable option. It allows input that's not present within the options. See more on vue-select documentation about taggable functionality. 

## License

MIT