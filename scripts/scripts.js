(function () {
    'use strict'
    
    var ID_AUTHOR = "textAuthor",
        ID_TITLE = "textTitle",
        ID_BUTTON_ADD = "buttonAdd",
        ID_DIV_INPUT = "divInput",
        ID_DIV_TABLE = "divTable",
        ID_TABLE_TASKS = "tableTasks",
        KEY = 'key',
        KEY_SEPARATOR = ';|';
        
        
    init(); 
   
    /*
        initialize page on start
    */
    function init() {
        makeRowsFromObjectArray(getKeysObjects(KEY));
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
        if (keys == null) {
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
        
        if (keys == null) return null;
        
        var keysArray = keys.split(KEY_SEPARATOR),
            keysArrayObjects = [],
            newKeysArray = [],
            newKeys;

        for (var i = 0; i < keysArray.length; i++) {
            keysArrayObjects[i] = JSON.parse(keysArray[i]);
        }
        return keysArrayObjects;
    }
    
    
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
                    keysArrayObjects[i][attribute] = value
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
        element.innerHTML = makeRowInnerHtml(id, status, name, author, date);
        $("#" + ID_TABLE_TASKS).append(element);
        return element;
    }
    
    /*
        delete row by id;
        return true if found&deleted,
               else if id doesn't exist
    */
    function deleteRowById(id) {
        var table = $("#" + ID_TABLE_TASKS + " #" + id);
        if (table.length == 0) return false;
        
        table.detach();
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
 
        if (keysArrayObjects == null) {

            return false;
        }
        
        for (var i = 0; i < keysArrayObjects.length; i++) { 
            if (oldId == keysArrayObjects[i].id) {
                isFoundFlag = true;
                keysArrayObjects.splice(i, 1);
            }
            if (isFoundFlag == true) break;
        }

        if (isFoundFlag == false) 
            return false;
        
        if (keysArrayObjects.length == 0) {
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
    
    
    
    function makeRowsFromObjectArray(localStorageObjects) {
        if (localStorageObjects == null) 
            return;
        
        for (var i = 0; i < localStorageObjects.length; i++) {
            var id = localStorageObjects[i].id,
                title = localStorageObjects[i].title,
                author = localStorageObjects[i].author,
                done = localStorageObjects[i].done,
                updated = localStorageObjects[i].updated;
                makeRow(id, done, title, author, new Date(updated));
        }
        
    }
    
    
    /*
        clearing all inputTexts in arguments,
        argument is the jquery link!
    */
    function clearInputTexts(inputElement) {
        for (var i = 0; i < arguments.length; i++) {
            arguments[i].val('');
        }
    }
    
    
    /*
        return date string in format: dd:month:yyyy hh:mm
    */
    function getDateFormat(date) {
        var monthNames = [
            "Январь", "Февраль", "Март", "Апрель", "Май",
            "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", 
            "Ноябрь", "Декабрь"
        ];
        
        var day_ = date.getDay(),
            day = addZeroInFront(day_),
            month = date.getMonth(),
            year = date.getFullYear(),
            hour = date.getHours(),
            minutes_ = date.getMinutes();
        
        var minutes = addZeroInFront(minutes_);
        //var minutes = minutes_ > 9 ? minutes_ : '0' + minutes_;
            
        function addZeroInFront(number) {
            return number > 9 ? number : '0' + number;
        }
        var result = day + ':' + monthNames[month] + ':' + year  + '   ' + hour + ':' + minutes;
        
        return result;
    }
    
    
    /*
        Event functions
    */
    buttonAdd.onclick = function () {
 
        
        var author_ = $("#" + ID_AUTHOR).val(),
            author = author_.trim(),
            title_ = $("#" + ID_TITLE).val(),
            title = title_.trim(),
            date = new Date(),
            id = +date;
        
        if (author == '' || title == '') 
            return;
        
        var newRow = makeRow(id, false, title, author, date);
        
        addToLocalStorage(date, title, author);
        
        
        clearInputTexts($('#' + ID_AUTHOR), $('#' + ID_TITLE));
    };
    
    $("#" + ID_TABLE_TASKS).on('click', 'input.delete-button', function(ev){
        var input = ev.target;
        var td = input.parentNode;
        var tr = td.parentNode;
        var id = $(tr).attr('id');
        
        var ls = deleteObjectInLocalStorageById(+id);
        var row = deleteRowById(+id); 
        
    });
    
    $("#" + ID_TABLE_TASKS).on('blur', '.writable-input', function(ev){
        var input = ev.target;
        var td = input.parentNode;
        var tr = td.parentNode;
        
        var id = $(tr).attr('id'), 
            attribute = $(td).attr('data-id'),
            value = $(input).val();
        if (changeObjectInLocalStorage(id, attribute, value)) {
            
            var updated = $(tr).children().eq(3);
            updated[0].innerText = getDateFormat(new Date());
        } else {
            return;
        }
    });
    
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
    
                                  
})();