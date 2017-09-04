import { inject, bindable, BindingEngine, observable, computedFrom } from 'aurelia-framework'
var UnitLoader = require('../../../loader/unit-loader');
var SupplierLoader = require('../../../loader/garment-supplier-loader');
var DeliveryOrderBySupplierLoader = require('../../../loader/garment-delivery-order-by-supplier-loader');
var moment = require('moment');

@inject(BindingEngine, Element)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable error = {};
    @bindable unit;
    @bindable supplier;
    @bindable deliveryOrder;

    constructor(bindingEngine, element) {
        this.bindingEngine = bindingEngine;
        this.element = element;

        this.auInputOptions = {
            label: {
                length: 4,
                align: "right"
            },
            control: {
                length: 5
            }
        };

        this.deliveryOrderItem = {
            columns: [
                { header: "Barang" },
                { header: "Jumlah" },
                { header: "Satuan" },
                { header: "Keterangan" }
            ],
            onRemove: function () {
                this.bind();
            }
        };
    }

    @computedFrom("data._id")
    get isEdit() {
        return (this.data._id || '').toString() != '';
    }

    @computedFrom("data.supplier")
    get filter() {
        var filter = {
            supplierId: this.data.supplierId
        };
        return filter;
    }

    bind() {
        if (this.data && this.data.supplier)
            this.data.supplier.toString = function () {
                return this.code + " - " + this.name;
            };

        if (!this.readOnly) {
            this.deliveryOrderItem.columns.push({ header: "" });
        }
    }

    supplierChanged(newValue, oldValue) {
        var selectedSupplier = newValue;

        if (selectedSupplier) {
            this.data.supplier = selectedSupplier;
            this.data.supplierId = selectedSupplier._id;
        }
        else {
            this.data.supplierId = undefined;
        }

        this.deliveryOrderAU.editorValue = "";
        this.data.deliveryOrderId = undefined;
    }

    unitChanged(newValue, oldValue) {
        var selectedUnit = newValue;

        if (selectedUnit) {
            this.data.unit = selectedUnit;
            this.data.unitId = selectedUnit._id;
        }
        else {
            this.data.unitId = null;
        }
    }

    deliveryOrderChanged(newValue, oldValue) {
        var selectedDo = newValue;

        if (selectedDo) {
            this.data.deliveryOrder = selectedDo;
            this.data.deliveryOrderId = selectedDo._id;
            var selectedItem = selectedDo.items || []
            var _items = [];
            for (var item of selectedItem) {
                for (var fulfillment of item.fulfillments) {
                    var _item = {};
                    _item.product = fulfillment.product;
                    _item.deliveredUom = fulfillment.purchaseOrderUom;
                    _item.purchaseOrderNo = fulfillment.purchaseOrderNo;
                    _item.purchaseOrderId = fulfillment.purchaseOrderId;
                    _item.purchaseRequestNo = fulfillment.purchaseRequestNo;
                    _item.purchaseRequestId = fulfillment.purchaseRequestId;
                    _item.purchaseOrderQuantity = fulfillment.purchaseOrderQuantity;
                    _item.currency = fulfillment.currency;
                    _item.pricePerDealUnit = fulfillment.pricePerDealUnit;

                    var total = fulfillment.realizationQuantity
                        .map(qty => qty.deliveredQuantity)
                        .reduce((prev, curr, index) => {
                            return prev + curr;
                        }, 0);

                    _item.deliveredQuantity = fulfillment.deliveredQuantity - total;

                    if (_item.deliveredQuantity > 0)
                        _items.push(_item);
                }
            }
            this.data.items = _items;
        }
        else {
            this.data.items = [];
        }
        this.resetErrorItems();
    }

    resetErrorItems() {
        if (this.error) {
            if (this.error.items) {
                this.error.items = [];
            }
        }
    }

    get unitLoader() {
        return UnitLoader;
    }

    get supplierLoader() {
        return SupplierLoader;
    }

    get deliveryOrderBySupplierLoader() {
        return DeliveryOrderBySupplierLoader;
    }

    unitView = (unit) => {
        return `${unit.division.name} - ${unit.name}`;
    }

    supplierView = (supplier) => {
        return `${supplier.code} - ${supplier.name}`;
    }
} 