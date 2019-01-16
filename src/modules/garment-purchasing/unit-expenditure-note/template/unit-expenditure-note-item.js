import { bindable, computedFrom } from 'aurelia-framework'
import { Service } from "../service";
export class UnitDeliveryOrderItem {

  async activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;		
    this.readOnly = context.options.readOnly;
    this.options = this.context.options;

    // console.log(this.options);
    this.hasView = this.context.context.options.hasView;
    this.hasEdit = this.context.context.options.hasEdit;
    this.hasCreate = this.context.context.options.hasCreate;
    this.hasEdit = this.context.context.options.hasEdit;
    console.log(this.context.context.options);
    // console.log(this.hasView);
    if(this.data){
      if(this.hasView || this.hasEdit){
        this.data.IsSave=true;
      }
    }
  }

  @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

  productChanged(newValue){
    var selectedProduct = newValue;
    if(selectedProduct){
      this.data.Product.Id = selectedProduct.ProductId;
      this.data.Product.Name = selectedProduct.ProductName;
      this.data.Product.Code = selectedProduct.ProductCode;
      this.data.Product.Remark = selectedProduct.ProductRemark;
    }else{
      this.data.Product = null;
    }
  }

  controlOptions = {
    control: {
      length: 12
    }
  };
}