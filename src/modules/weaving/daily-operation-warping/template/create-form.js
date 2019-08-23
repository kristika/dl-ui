import { inject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "../service";
import moment from "moment";
var Operator = require("../../../../loader/weaving-operator-loader");
var FabricConstruction = require("../../../../loader/weaving-constructions-loader");
var Material = require("../../../../loader/weaving-material-type-loader");

@inject(Service, Router)
export class CreateForm {

    @bindable title;
    @bindable readOnly;
    @bindable Operator;
    @bindable Material;
    @bindable FabricConstruction;
    @bindable DateOperation;
    @bindable PreparationTime;
    @bindable Shift;

    constructor(service, router) {
        this.service = service;
        this.router = router;
    }

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan"
    };

    bind(context) {

        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
    }

    // Bindable Method
    DateOperationChanged(newValue) {
        this.data.DateOperation = moment(newValue).format();
    }

    OperatorChanged(newValue) {

        if (newValue) {
            this.data.OperatorId = newValue.Id;
        }
    }

    FabricConstructionChanged(newValue) {

        if (newValue) {
            this.data.ConstructionId = newValue.Id;
        }
    }

    PreparationTimeChanged(newValue) {
        this.data.TimeOperation = newValue;
        this.service.getShiftByTime(newValue)
            .then(result => {
                this.error.Shift = "";
                this.Shift = {};
                this.Shift = result;
                this.data.ShiftId = this.Shift.Id;
            })
            .catch(e => {
                this.Shift = {};
                this.data.ShiftId = this.Shift.Id;
                this.error.Shift = " Shift tidak ditemukan ";
            });
    }

    MaterialChanged(newValue) {

        if (newValue) {
            this.data.MaterialTypeId = newValue.Id;
        }
    }

    // Loaders
    get Operators() {

        return Operator;
    }

    get FabricConstructions() {
        return FabricConstruction;
    }

    get Materials() {
        return Material;
    }
}