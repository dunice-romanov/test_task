(function () {
    'use strict'
    
    var ID_AUTHOR = "textAuthor",
        ID_TITLE = "textTitle",
        ID_BUTTON_ADD = "buttonAdd",
        ID_DIV_INPUT = "divInput",
        ID_DIV_TABLE = "divTable",
        ID_TABLE_TASKS = "tableTasks",
        KEY = 'key',
        KEY_SEPARATOR = ',';
        
        
    function CreateLocalStorageData(date, title, author) {
        this.id = +date;
        this.title = title;
        this.author = author;
        this.done = false;
        this.updated = date;
    }

    /*
        Возможно нужен поиск одинаковых ключей перед добавлением
    */
    function addKeyToLocalStorage(key) {
        var keys = localStorage.getItem(KEY),
            keysArray;
        if (keys != null) {
            keysArray = keys.split(KEY_SEPARATOR);
            keysArray.push(key);
            keys = keysArray.join(KEY_SEPARATOR);
        } else {
            keysArray = [ key ];
            keys = keysArray.join(KEY_SEPARATOR);
        };
        
        localStorage.setItem(KEY, keys);
    }
    
    function addToLocalStorage(date, title, author) {
        
        function getLocalStorageString(date, title, author) {
            var localStorageData = new CreateLocalStorageData(date, title, author);
            return JSON.stringify(localStorageData);
        }
        
        var storageString = getLocalStorageString(date, title, author);
        localStorage.setItem(+date, storageString);
        
    }
    
    /*
        TODO: - учесть одинаковость аттрибутов и запретить выполнение лишних действий
              - добавить возврат тру/фолс при замене и нет     
    */
    function changeObjectInLocalStorage(id, attribute, value) {
        function findObject(oldId) {
            return JSON.parse(localStorage.getItem(id));
        }
        
        
        var oldId = id, 
            oldLocalStorageObject = findObject(oldId),
            localStorageObjectUpdatedString;
        if (oldLocalStorageObject[attribute] == value) {
            
            return false;
            
        } else {
            oldLocalStorageObject[attribute] = value;
            oldLocalStorageObject.updated = new Date();

            localStorageObjectUpdatedString = JSON.stringify(oldLocalStorageObject);

            localStorage.removeItem(oldId);
            localStorage.setItem(oldId, localStorageObjectUpdatedString);
            return true;
        }
        
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
    
    /*
        TODO: Разобраться с форматом даты, что бы 
        она нормально подключалась после обновления страницы
    */
    
    function makeRowsFromKeys(keys) {
        if (keys == null) 
            return;
        var keysArray = keys.split(KEY_SEPARATOR),
            localStorageObjects = [],
            storage = localStorage;
        
        for(var i = 0; i < keysArray.length; i++) {
            var localStrorageObject = JSON.parse(storage.getItem(keysArray[i]));
            
            localStorageObjects.push(localStrorageObject);
        }
        for (var i = 0; i < localStorageObjects.length; i++) {
            var id = localStorageObjects[i].id,
                title = localStorageObjects[i].title,
                author = localStorageObjects[i].author,
                done = localStorageObjects[i].done,
                updated = localStorageObjects[i].date;
                debugger;
            makeRow(id, done, title, author, new Date(id));
        }
        
    }
    
    makeRowsFromKeys(localStorage.getItem(KEY));
    
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
            minute = date.getMinutes();
        
        var result = day + ':' + monthNames[month] + ':' + year  + '   ' + hour + ':' + minute;
        
        return result;
    }
    
    
    /*
        Event functions
    */
    buttonAdd.onclick = function () {
 
        
        var author = $("#" + ID_AUTHOR).val(),
            title = $("#" + ID_TITLE).val(),
            date = new Date(),
            id = +date;
        
        if (author == '' || title == '') 
            return;
        
        var newRow = makeRow(id, false, title, author, date);
        
        addToLocalStorage(date, title, author);
        addKeyToLocalStorage(id);
        
        
        clearInputTexts($('#' + ID_AUTHOR), $('#' + ID_TITLE));
    };
    
    
    
    $("#tableTasks").on('blur', '.writable-input', function(ev){
        var input = ev.target;
        var td = input.parentNode;
        var tr = td.parentNode;
        
        var id = $(tr).attr('id'), 
            attribute = $(td).attr('data-id'),
            value = $(input).val();
        //console.log(localStorage.getItem(id));
        if (changeObjectInLocalStorage(id, attribute, value)) {
            
            var updated = $(tr).children().last();
            updated[0].innerText = getDateFormat(new Date());
//            console.log('updated!');
//            console.log(localStorage.getItem(id));
        } else {
            return;
        }
        
        
    });
    
                                  
})();