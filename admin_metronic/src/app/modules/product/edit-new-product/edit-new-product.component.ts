import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../../categories/_services/categories.service';
import { ProductService } from '../_services/product.service';
import { Toast, Toaster } from 'ngx-toast-notifications';
import { NoticyAlertComponent } from 'src/app/componets/notifications/noticy-alert/noticy-alert.component';

@Component({
  selector: 'app-edit-new-product',
  templateUrl: './edit-new-product.component.html',
  styleUrls: ['./edit-new-product.component.scss']
})
export class EditNewProductComponent implements OnInit {

  product_id:any = null;
  product_selected:any = null;

  title:any = null;
  sku:any = null;
  categories:any = [];
  categorie:any = "";
  price_soles:any = 0;
  price_dollars:any = 0;
  imagen_file:any = null;
  imagen_previzualizacion:any = null;
  description:any = null;
  resumen:any = null;
  //
  tag:any = null;
  tags:any = [];
  
  isLoading$:any;
  constructor(
    public _productService: ProductService,
    public router: Router,
    public _categorieService:CategoriesService,
    public activeRouter: ActivatedRoute,
    public toaster: Toaster,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this._productService.isLoading$;
    this.activeRouter.params.subscribe((resp:any) => {
      console.log(resp);
      this.product_id = resp.id;
    });
    this._productService.showProduct(this.product_id).subscribe((resp:any) => {
      console.log(resp);
      this.product_selected = resp.product;

      this.title = this.product_selected.title;
      this.sku = this.product_selected.sku;
      this.categorie = this.product_selected.categorie._id;
      this.price_soles = this.product_selected.price_soles;
      this.price_dollars = this.product_selected.price_dollars;

      this.imagen_previzualizacion = this.product_selected.imagen;
      this.description = this.product_selected.description;
      this.resumen = this.product_selected.resumen;
      this.tags = this.product_selected.tags;
    })
    this._categorieService.allCategories().subscribe((resp:any) => {
      console.log(resp);
      this.categories = resp.categories;
      this.loadServices();
    });
  }
  loadServices(){
    this._productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this._productService.isLoadingSubject.next(false);
    }, 50);
  }
  processFile($event){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.imagen_previzualizacion = null;
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Upps! Necesita ingresar un archivo de tipo imagen.'`});
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_file);
    reader.onloadend = () => this.imagen_previzualizacion = reader.result;
    this.loadServices();
  }
  addTag(){
    this.tags.push(this.tag);
    this.tag = "";
  }
  removeTag(i){
    this.tags.splice(i, 1);
  }
  update(){
    if(!this.title || !this.sku || !this.categorie || !this.price_soles || !this.price_dollars || !this.resumen || this.tags.length == 0){ 
      this.toaster.open(NoticyAlertComponent, {text: `danger-'Upps! NECESITAS DIGITAR TODOS LOS CAMPOS DEL FORMULARIO.'`});
      return;
    }
    let formData = new FormData();
    formData.append("_id", this.product_id);
    formData.append("title", this.title);
    formData.append("sku", this.sku);
    formData.append("categorie", this.categorie);
    formData.append("price_soles", this.price_soles);
    formData.append("price_dollars", this.price_dollars);
    
    formData.append("description", this.description);
    formData.append("resumen", this.resumen);
    formData.append("tags", JSON.stringify(this.tags));
    if (this.imagen_file) {
      formData.append("imagen", this.imagen_file);
    }

    this._productService.updateProduct(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.code == 403){
        this.toaster.open(NoticyAlertComponent, {text: `danger-'Upps! EL PRODUCTO YA EXISTE, DIGITAR OTRO NOMBRE'`});
        return;
      }else{
        this.toaster.open(NoticyAlertComponent, {text: `primary-'EL PRODUCTO SE HA EDITADO CON EXITO'`});
        return;
      }
    })
  }
  listProducts(){
    this.router.navigateByUrl('/productos/lista-de-todos-los-productos');
  }
}
