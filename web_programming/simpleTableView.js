function SimpleTableView(model) {
    if (model instanceof TableModel) {
        this.model = model;
    } else throw "Invalid model";

};


SimpleTableView.prototype = (function () {



    return {

        createTable : function () {

            var model = this.model;


            var table = document.createElement("table");
            var htr = document.createElement("tr");
            table.appendChild(htr);
            htr.appendChild(document.createElement("th"));
            model.forEachCol(function (c) {
                var th = document.createElement("th");
                th.appendChild(document.createTextNode(c));
                htr.appendChild(th);
            });

            model.forEachRow(function (r) {
                var tr = document.createElement("tr");
                table.appendChild(tr);
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(r));
                tr.appendChild(td);
                model.forEachCol(function (c) {
                    var cell = model.getCell(c, r);
                    var td = document.createElement("td");
                    td.appendChild(document.createTextNode(cell.getValue()));
                    tr.appendChild(td);
                });
            });

            return table;
        },

        createTableForId: function (id) {
            var elem = document.getElementById(id);
            if (elem) {
                elem.innerHTML = "";
                elem.appendChild(this.createTable());
            };
        }


    }



})();
