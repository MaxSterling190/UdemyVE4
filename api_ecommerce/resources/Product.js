export default { 
    product_list: (product,variedades = []) => {
        let tags = product.tags;
        if (typeof tags === 'string') {
            try {
            tags = JSON.parse(tags);
            } catch (e) {
                tags = [];
            }
        }
        return {
            _id: product._id,
            title: product.title,
            sku: product.sku,
            slug: product.slug,
            imagen: 'http://localhost:3000'+'/api/products/uploads/product/'+product.portada, //*
            categorie: product.categorie,
            price_soles: product.price_soles,
            price_dollars: product.price_dollars,
            stock: product.stock,
            description: product.description,
            resumen: product.resumen,
            tags: tags,
            type_inventario: product.type_inventario,
            state: product.state,
            variedades: variedades,
        }
    }
}