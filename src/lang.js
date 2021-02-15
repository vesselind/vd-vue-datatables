var bg = {
    'add-new-record':'Добави',
    'filters' : 'Филтри',

    //options column tooltips
    'tooltip-view': 'Преглед',
    'tooltip-edit': 'Редакция на записа',
    'tooltip-delete': 'Изтриване на записа',

    //dialogs
    'close-button': 'Затвори',
    'clear-filters': 'Изчисти филтри',
    'apply-filters': 'Приложи филтрите',

    'create-modal-title': 'Добавяне на нов запис',
    'edit-modal-title': 'Редакция на избран запис',
    'save-changes-button': 'Запамети промените',
    'create-record-button': 'Добави',

    //delete
    'delete-question': 'Желаете ли да изтриете избрания запис?',
    'delete-cancel': 'Отказ',
    'delete-confirm': 'Изтриване',

    //pages
    'page-previous': '<<',
    'page-next': '>>',
    'page-first': '<< Първа',
    'page-last' : 'Последна >>',
}

var en = {
    'add-new-record':'Add New',
    'filters' : 'Filters',

    //options column tooltips
    'tooltip-view': 'View',
    'tooltip-edit': 'Edit',
    'tooltip-delete': 'Delete',

    //dialogs
    'close-button': 'Cancel',
    'clear-filters': 'Clear Filters',
    'apply-filters': 'Apply Filters',

    'create-modal-title': 'Add New',
    'edit-modal-title': 'Edit',
    'save-changes-button': 'Save changes',
    'create-record-button': 'Add',

    //delete
    'delete-question': 'Do you want to remove the selected record?',
    'delete-cancel': 'Cancel',
    'delete-confirm': 'Delete',

    //pages
    'page-previous': '<<',
    'page-next': '>>',
    'page-first': '<< First',
    'page-last' : 'Last >>',

}


var user_lang = navigator.language || navigator.userLanguage; 

var lang = function(caption){
    if (user_lang=='bg-BG'){
        return bg[caption];
    }else{
        return en[caption];
    }

}


export default lang;