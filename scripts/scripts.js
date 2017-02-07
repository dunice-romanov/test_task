(function () {
    'use strict'
    function CreateLocalStorageData(title, author) {
        this.id = +new Date();
        this.title = title;
        this.author = author;
        this.done = false;
        this.updated = new Date();
    }

    var localStData = new CreateLocalStorageData("hello", "world");

    var str = JSON.stringify(localStData);

    function makeRow(status, name, author, date) {
        function makeRowInnerHtml(status, name, author, date) {
            var htmlResult = "<td>" + status + "</td>" + 
                "<td>" + name + "</td>" + "<td>" + author + "</td>" + "<td>" + getDateFormat(date) + "</td>";
            return htmlResult;
        }
        
        var element = document.createElement("tr");
        element.innerHTML = makeRowInnerHtml(status, name, author, date);
        return element;
    }

    buttonAdd.onclick = function () {
        var author = $("#textAuthor").val(),
            name = $("#textTitle").val(),
            status = document.getElementById("checkboxStatus").checked;
        var newRow = makeRow(status, name, author, new Date());
        $("#tableTasks").append(newRow);
    };


    function inputText(context) {
        context.value = '';
    }
    
    function getDateFormat(date) {
        var monthNames = [
          "Январь", "Февраль", "Март", "Апрель", "Май",
            "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        
        var day = date.getDay(), 
            month = date.getMonth(),
            year = date.getFullYear(),
            hour = date.getHours(),
            minute = date.getMinutes();
        
        var result = day + ':' + monthNames[month] + ':' + year  + '   ' + hour + ':' + minute;
        
        return result;
    }
    
    
})();