import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';

@inject(Router, Service)
export class View {
    hasCancel = true;
    hasEdit = false;
    hasDelete = false;
    hasUnpost = false;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        var isVoid = false;
        var isArriving = false;
        var id = params.id;
        this.poExId = id;
        this.data = await this.service.getById(id);
        if (this.data.doQuantity && this.data.doQuantity>0) {
            isVoid = true;
        }
        console.log(this.data)
        // if (this.data.items.find(po => { return po.status.value > 3 }) != undefined) {
        //     isArriving = true;
        // }
        if (!this.data.isPosted) {
            this.hasDelete = true;
            this.hasEdit = true;
        }
        if (this.data.isPosted && !isVoid && !this.data.isClosed) {
            this.hasUnpost = true;
        }
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    edit(event) {
        this.router.navigateToRoute('edit', { id: this.data._id });
    }

    delete(event) {
        this.service.delete(this.data).then(result => {
            this.cancel();
        });
    }

    cancelPO(e) {
        this.service.cancel(this.poExId).then(result => {
            this.cancel();
        }).catch(e => {
            this.error = e;
        })
    }

    unpostPO(e) {
        this.service.unpost(this.poExId).then(result => {
            this.cancel();
        }).catch(e => {
            this.error = e;
        })
    }

    closePO(e) {
        this.service.close(this.poExId).then(result => {
            this.cancel();
        }).catch(e => {
            this.error = e;
        })
    }

}