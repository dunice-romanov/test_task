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

    function makeRow(status, name, author, lastUpdated) {
        
        function makeRowInnerHtml(status, name, author) {
            var htmlResult = "<td>" + status + "</td>" + "<td>" + name + "</td>" + "<td>" + author + "</td>" + "<td>" + new Date() + "</td>";
            return htmlResult;
        }
        
        var element = document.createElement("tr");
        element.innerHTML = makeRowInnerHtml(status, name, author, lastUpdated);
        
        return element;
    }

    buttonAdd.onclick = function () {
        var author = $("#textAuthor").val(),
            name = $("#textTitle").val(),
            status = document.getElementById('statusCheckBox').checked;
        
        var newRow = makeRow(status, name, author);
        $("#firstRow").append(newRow);
    };


    function inputText(context) {
        context.value = '';
    }
})();