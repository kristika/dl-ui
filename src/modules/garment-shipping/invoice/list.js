import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {

    context = ["detail","Cetak PDF FOB", "Cetak PDF FOB-CMT"]

    columns = [
        { field: "invoiceNo", title: "No Invoice" },
       
        {
            field: "invoiceDate", title: "Tgl Invoice", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "from", title: "From" },
        { field: "to", title: "To"},
        { field: "buyerAgent.name", title: "Buyer Agent" },
        {
            field: "sailingDate", title: "Sailing", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
    ];

    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        }

        return this.service.search(arg)
            .then(result => {
                console.log(result.data);
                
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    contextClickCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "detail":
                this.router.navigateToRoute('view', { id: data.id });
                break;
            case "Cetak PDF FOB": 
                this.service.getPdfById(data.id, "fob"); 
                break;
            case "Cetak PDF FOB-CMT": 
                this.service.getPdfById(data.id, "cmt"); 
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}
