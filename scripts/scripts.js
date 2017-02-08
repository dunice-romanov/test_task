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
        
        
    
    makeRowsFromObjectArray(getKeysObjects(KEY));
    
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
        
        function makeRowInnerHtml(id, status, name, author, date) {
            var TAG_INPUT_FIRST_HALF = "<input class='writable-input' value='",
                TAG_INPUT_SECOND_HALF = "'>";
            var htmlResult = "<td data-id='done'>" +  status +  "</td>" +  
                "<td data-id='title'>" + TAG_INPUT_FIRST_HALF + name + TAG_INPUT_SECOND_HALF + "</td>" + 
                "<td data-id='author'>" + TAG_INPUT_FIRST_HALF + author + TAG_INPUT_SECOND_HALF + "</td>" + 
                "<td data-id='updated'>" + getDateFormat(date) + "</td>";
            return htmlResult;
        }
        
        var element = document.createElement("tr");
        element.setAttribute('id', +date);
        element.innerHTML = makeRowInnerHtml(id, status, name, author, date);
        $("#" + ID_TABLE_TASKS).append(element);
        return element;
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
        
        var day = date.getDay(), 
            month = date.getMonth(),
            year = date.getFullYear(),
            hour = date.getHours(),
            minutes_ = date.getMinutes();
            var minutes = minutes_ > 9 ? minutes_ : '0' + minutes_;
            
        
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
    
    
    
    $("#" + ID_TABLE_TASKS).on('blur', '.writable-input', function(ev){
        var input = ev.target;
        var td = input.parentNode;
        var tr = td.parentNode;
        
        var id = $(tr).attr('id'), 
            attribute = $(td).attr('data-id'),
            value = $(input).val();
        if (changeObjectInLocalStorage(id, attribute, value)) {
            
            var updated = $(tr).children().last();
            updated[0].innerText = getDateFormat(new Date());
        } else {
            return;
        }
        
        
    });
    
                                  
})();