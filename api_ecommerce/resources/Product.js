export default { 
    product_list: (product) => {
        return {
            _id: product._id,
            title: product.title,
            slug: product.slug,
            imagen: 'http://localhost:3000/'+'/uploads/product/'+product.portada, //*
            categorie: product.categorie,
            price_soles: product.price_soles,
            price_dollars: product.price_dollars,
            stock: product.stock,
            description: product.description,
            resumen: product.resumen,
            tags: product.tags ? JSON.parse(product.tags): [],
            type_inventario: product.type_inventario,
            state: product.state,
        }
    }
}