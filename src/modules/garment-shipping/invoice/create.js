import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { activationStrategy } from 'aurelia-router';

@inject(Router, Service)
export class Create {
    hasCancel = true;
    hasSave = true;
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    bind() {
        this.data = { items: [] };
        this.error = {};
        console.log(this.data);
    }

    determineActivationStrategy() {
        return activationStrategy.replace; //replace the viewmodel with a new instance
        // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
        // or activationStrategy.noChange to explicitly use the default behavior
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    save(event) {
        console.log(this.data);
        for(var item in this.data.items)
        {
            if(item.quantity == "")
            {item.quantity =0;}
            if(item.price == "")
            {item.price =0;}
        }
        this.service.create(this.data)
            .then(result => {
                console.log(result);
                alert("Data berhasil dibuat");
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(error => {
                this.error = error;
                console.log(this.error);
            });
    }
    
    cancel(event) {
        this.router.navigateToRoute('list');
    }
}