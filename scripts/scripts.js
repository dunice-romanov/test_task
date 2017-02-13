$(document).ready(function() {
    'use strict';
    
    var ID_AUTHOR = "textAuthor",
        ID_TITLE = "textTitle",
        ID_TABLE_TASKS = "tableTasks",
        KEY = 'key',
        KEY_SEPARATOR = ';|',
        CLASS_SORT_MINMAX = 'sorted-min-max',
        CLASS_SORT_MAXMIN = 'sorted-max-min',
        TEXT_NO_INPUT = 'Please, enter both',
        DATA_OLD_VALUE = 'data-old-value';
        
        
    init(); 
   
    
    /*
        initialize page on start
    */
    function init() {
        initDataTable();
        var newArray = getKeysObjects(KEY);
        makeRowsFromObjectArray(newArray);
    }
    
    function initDataTable() { 
         $('#' + ID_TABLE_TASKS).dataTable({
            "searching": false,
             "ordering": false
         });
      }
    
    function CreateLocalStorageData(date, title, author) {
        this.id = +date;
        this.title = title;
        this.author = author;
        this.done = false;
        this.updated = date;
    }

    
    function addToLocalStorage(date, title, author) {
        function getLocalStorageString(date, title, author) {
            var localStorageData = new CreateLocalStorageData(date, title, author);
            return JSON.stringify(localStorageData);
        }
        
        var keysArray, 
            newKeysString,
            keys = localStorage.getItem(KEY),
            newKey = getLocalStorageString(date, title, author); 
        if (keys === null) {
            keysArray = [ ];
            keysArray.push(newKey);
        } else {
            keysArray = keys.split(KEY_SEPARATOR);
            keysArray.push(newKey);
            
        }
        
        newKeysString = keysArray.join(KEY_SEPARATOR);
        localStorage.setItem(KEY, newKeysString);
        
    }
    
    
    /*
        parse array of localStorageObjects from string;
        return null if object is empty;
    */
    function getKeysObjects(key) {
        
        var storage = localStorage;
        var keys = storage.getItem(KEY);
        
        if (keys === null) return null;
        
        var keysArray = keys.split(KEY_SEPARATOR),
            keysArrayObjects = [];

        for (var i = 0; i < keysArray.length; i++) {
            keysArrayObjects[i] = JSON.parse(keysArray[i]);
        }
        return keysArrayObjects;
    }
    
    
    /*
        finds first object with arguments and rewrite it;
        return  true if rewrote;
                else if can't find;
    */
    function changeObjectInLocalStorage(id, attribute, value) {
        var storage = localStorage;

        var oldId = id,
            keysArrayObjects = [],
            newKeysArray = [],
            newKeys;
            
        keysArrayObjects = getKeysObjects(KEY);    
        
        for (var i = 0; i < keysArrayObjects.length; i++) {
            if (oldId == keysArrayObjects[i].id) {

                if (keysArrayObjects[i][attribute] == value) {
                    return false;
                }
                else {
                    keysArrayObjects[i][attribute] = value;
                    keysArrayObjects[i].updated = new Date();
                }
            }
        }

        for (var i = 0; i < keysArrayObjects.length; i++) {
            newKeysArray[i] = JSON.stringify(keysArrayObjects[i]);
        }

        newKeys = newKeysArray.join(KEY_SEPARATOR);
        storage.setItem(KEY, newKeys);
        return true;
    }
    
    
    /*
    	appends new row  to the table from arguments,
    	returns element <tr></tr>
    */
    function makeRow(id, status, name, author, date) {
        
        function getCheckboxTag(status) {
            var tagFirstHalf = "<input class='checkbox' type='checkbox' ",
                tagSecondHalf = ">";
            if (status) {
                return tagFirstHalf + 'checked' + tagSecondHalf;
            } else {
                return tagFirstHalf + 'unchecked' + tagSecondHalf;
            }
        }
        
        function makeRowInnerHtml(id, status, name, author, date) {
            var TAG_INPUT_FIRST_HALF = "<input type='text' class='writable-input' value='",
                TAG_INPUT_SECOND_HALF = "'>";
            var htmlResult = "<td data-id='done'>" + getCheckboxTag(status) +  
                "<td data-id='title'>" + TAG_INPUT_FIRST_HALF + name + TAG_INPUT_SECOND_HALF + "</td>" + 
                "<td data-id='author'>" + TAG_INPUT_FIRST_HALF + author + TAG_INPUT_SECOND_HALF + "</td>" + 
                "<td data-id='updated'>" + getDateFormat(date) + "</td>" +
                "<td data-id='delete'>" + "<input type='button' class='delete-button' value='x'>" + "</td>";
            return htmlResult;
        }
        
        var element = document.createElement("tr");
        element.setAttribute('id', +id);
        element.setAttribute('class', 'dataRow');
        element.innerHTML = makeRowInnerHtml(id, status, name, author, date);
        return element;
    }
    
    
    /*
        delete row by id;
        return true if found&deleted,
               else if id doesn't exist
    */
    function deleteRowById(id) {
        var tableRow = $("#" + ID_TABLE_TASKS + " #" + id);
        
        if (tableRow.length === 0) return false;
        
        $('#' + ID_TABLE_TASKS).DataTable().row(tableRow).remove().draw();
        
        return true;
    }
    
    
    /*
        delete object in localStorage by id;
        return true if found&deleted,
               else if id doesn't exist
    */
    function deleteObjectInLocalStorageById(id) {
        var storage = localStorage;

        var oldId = id,
            keysArrayObjects = [],
            newKeysArray = [],
            newKeys,
            isFoundFlag = false;
            
        keysArrayObjects = getKeysObjects(KEY);    
 
        if (keysArrayObjects === null) {

            return false;
        }
        
        for (var i = 0; i < keysArrayObjects.length; i++) { 
            if (oldId == keysArrayObjects[i].id) {
                isFoundFlag = true;
                keysArrayObjects.splice(i, 1);
            }
            if (isFoundFlag === true) break;
        }

        if (isFoundFlag === false) 
            return false;
        
        if (keysArrayObjects.length === 0) {
            storage.removeItem(KEY);
            return true;
        }
            
            
        for (var i = 0; i < keysArrayObjects.length; i++) {
            newKeysArray[i] = JSON.stringify(keysArrayObjects[i]);
        }
        newKeys = newKeysArray.join(KEY_SEPARATOR);
        storage.setItem(KEY, newKeys);
        return true;
    }
    
    
    /*
        appends  rows  from  localStorageObject;
    */
    function makeRowsFromObjectArray(localStorageObjects) {
        if (localStorageObjects === null) 
            return;
        for (var i = 0; i < localStorageObjects.length; i++) {
            var id = localStorageObjects[i].id,
                title = localStorageObjects[i].title,
                author = localStorageObjects[i].author,
                done = localStorageObjects[i].done,
                updated = localStorageObjects[i].updated,
                tableRow = makeRow(id, done, title, author, new Date(updated));
                $("#" + ID_TABLE_TASKS).DataTable().row.add(tableRow).draw();
        }
        
    }
    
    
    /*
        clearing all inputTexts in arguments,
        argument must be the jquery link!
    */
    function clearInputTexts(inputElement) {
        for (var i = 0; i < arguments.length; i++) {
            arguments[i].val('');
        }
    }
    
    
    /*
        return date string in format: dd:mm:yyyy hh:mm
    */
    function getDateFormat(date) {
        
        function addZeroInFront(number) {
            return number > 9 ? number : '0' + number;
        }
        
        var day_ = date.getDate(),
            day = addZeroInFront(day_),
            month_ = date.getMonth() + 1,     //'+ 1' is because getMonth() returns num from 0 to 11; 
            month = addZeroInFront(month_),
            year = date.getFullYear(),
            hour = date.getHours(),
            minutes_ = date.getMinutes();
        
        var minutes = addZeroInFront(minutes_);
        
        var result = day + '.' + month + '.' + year  + '   ' + hour + ':' + minutes;
        
        return result;

    }
    
    
    /*
        Sorting  feature:
        return  null  if  not sorted,
                new array  if sorted;
                if minmax =  true  -  sorted from min to max, else -  max to min
    */
    function sortObjectsArray(attribute, array, minmax) {
        if (array === null || array.length < 2 ) return null;
        
        if (!(attribute in array[0])) return null;   
        
        if (minmax === true) {
                var newArray = array.sort(compareMinToMax); 
        } else {
            var newArray = array.sort(compareMaxToMin);
        }
        
        return newArray;
        
        function compareMinToMax(a, b) {
            if (a[attribute] > b[attribute]) return 1;
            if (a[attribute] < b[attribute]) return -1;  
        }
        
        function compareMaxToMin(a, b) {
            if (a[attribute] > b[attribute]) return -1;
            if (a[attribute] < b[attribute]) return 1;  
        }
    }
    
    
    function getSortClassFromObject(object, class1, class2) {
        for (var i = 1; i < arguments.length; i++) {
            if(object.hasClass(arguments[i]))
                return arguments[i];
        }
        return null;
    }
    
    /*
        takes jquery link to columnTableHeader and localStorageArray;
        returns new sorted localStorageArray by watching table headear's class
            or null if cant sort;
        
        if class = none or class = CLASS_SORT_MINMAX -> sort CLASS_SORT_MINMAX, change class to CLASS_SORT_MAXMIN
        if class = CLASS_SORT_MAXMIN  -> sort max-min, change class to CLASS_SORT_MINMAX 
    */
    function sortColumns(columnTableHeader, localStorageObjectsArray) {
        var className = getSortClassFromObject(columnTableHeader, CLASS_SORT_MINMAX, CLASS_SORT_MAXMIN),
            newArray,
            tableRow;
        if (className === null || className =="") {
            columnTableHeader.addClass(CLASS_SORT_MINMAX);
            className = CLASS_SORT_MINMAX;
        }
        
        tableRow = columnTableHeader.parent();
        tableRow.children().removeClass(CLASS_SORT_MAXMIN + ' ' + CLASS_SORT_MINMAX);
        
        newArray = sortObjectsArray(columnTableHeader.attr('id'), localStorageObjectsArray, analyzeClassName());
        if (newArray === null) return null;
        
        columnTableHeader.addClass(getOppositeClassName(className));
        return newArray;
        
        function analyzeClassName() {
            if (className == CLASS_SORT_MAXMIN) {
                return false;
            } else return true;
        }
        
        function getOppositeClassName(className) {
            if (className == CLASS_SORT_MAXMIN) {
                return CLASS_SORT_MINMAX;
            } else {
                return CLASS_SORT_MAXMIN;
            }
        }
    }
    
    function deleteAllDataRows() {
        $('#' + ID_TABLE_TASKS).DataTable().clear().draw();
    }
    
    
    /*
        Event functions
    */
    
    /*
        Button event
    */
    buttonAdd.onclick = function () {
        var author_ = $("#" + ID_AUTHOR).val(),
            author = author_.trim(),
            title_ = $("#" + ID_TITLE).val(),
            title = title_.trim(),
            date = new Date(),
            id = +date;
        
        if (author == '' || title == '') {
            alert(TEXT_NO_INPUT);
            return;
        } 

        
        var table = $("#" + ID_TABLE_TASKS).DataTable(),
            actualPageNumber = table.page();
        
        var tableRow = makeRow(id, false, title, author, date);
        table.row.add(tableRow).draw();
        table.page(actualPageNumber).draw('page');
        addToLocalStorage(date, title, author);
        
        clearInputTexts($('#' + ID_AUTHOR), $('#' + ID_TITLE));
    };
    
    
    /*
        delete button event 
        delition row and localStotageObject
    */
    $("#" + ID_TABLE_TASKS).on('click', 'input.delete-button', function(ev){
        var input = ev.target;
        var td = input.parentNode;
        var tr = td.parentNode;
        var id = $(tr).attr('id');
        
        deleteObjectInLocalStorageById(+id);
        deleteRowById(+id); 
        
    });
    
    /*
        table's input text event on focus
    */
    
    $("#" + ID_TABLE_TASKS).on('focus', '.writable-input', function(ev){
        var input = $(ev.target);
        input.attr(DATA_OLD_VALUE, input.val());
        
    });
    
    
    /*
        table's input text event on blur
    */
    $("#" + ID_TABLE_TASKS).on('blur', '.writable-input', function(ev){
        var input = ev.target;
        var td = input.parentNode;
        var tr = td.parentNode;
        var id = $(tr).attr('id'), 
            attribute = $(td).attr('data-id'),
            value = $(input).val().trim();
        if (value == "") {
            input.value = input.getAttribute(DATA_OLD_VALUE);
            return;
        }
        
        input.value = value;
        
        if (changeObjectInLocalStorage(id, attribute, value)) {
            
            var updated = $(tr).children().eq(3);
            updated[0].innerText = getDateFormat(new Date());
        } else {
            return;
        }
    });
    
    
    /*
        checkbox's event
    */
    $("#" + ID_TABLE_TASKS).on('click', '.checkbox', function(ev) {
        var input = ev.target;
        var td = input.parentNode;
        var tr = td.parentNode;
        
        var id = $(tr).attr('id'), 
            attribute = $(td).attr('data-id'),
            value = input.checked;
        
        if (changeObjectInLocalStorage(id, attribute, value)) {
            
            var updated = $(tr).children().eq(3);
            updated[0].innerText = getDateFormat(new Date());
        } else {
            return;
        }
        
    });
        

    /*
        table header's sortable divs event
    */
    $('#' + ID_TABLE_TASKS + ' div.sortable input').on('click', function(ev) {
        var tableHeader = $(ev.target).parent().parent(),
            newArray = getKeysObjects(KEY),
            table = $('#' + ID_TABLE_TASKS).DataTable();
        
        newArray = sortColumns(tableHeader, newArray);
        
        if (newArray !== null) {
            var actualPageNumber = table.page();
            deleteAllDataRows();
            makeRowsFromObjectArray(newArray);
            table.page(actualPageNumber).draw('page');
            
        }
    });
    
                                  
});