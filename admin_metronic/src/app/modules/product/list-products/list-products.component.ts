import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  products:any = [];
  isLoading$:any;
  constructor(
    public _productService:ProductService,

  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this._productService.allProducts().subscribe((resp:any) =>  {
      console.log(resp);
      this.products = resp.products;
    })
  }
  editProduct(product){
    

  }
  delete(product){

  }
}
