const express = require('express')
const router = express.Router();
const productController = require('../controllers/productController')
const upload = require('../middlewares/upload')

router.get('/', (req, res) => {
    productController.getProducts()
        .then((productsData) => {
            res.json(productsData)

        })
        .catch((error) => {
            res.status(500).send('Erro ao obter produtos!' + error)
        }) 
})

// localhost:3000/products/search/?searchTerm=
router.get('/search', (req, res) => {
    const searchTerm = req.query.searchTerm;
    productController.searchProducts(searchTerm)
    .then((products) => {
        res.json(products)
    })
    .catch((error) => {
        res.status(500).send("Erro ao buscar produto por termo! Detalhes: " + error)
    })
})


// localhost:3000/products/paginated?page=2&pageSize=15
router.get('/paginated', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    productController.getProductsPaginated(page, pageSize)
        .then((products) => {
            res.json(products)
        }) 
        .catch((error) => {
            res.status(500).send('Erro ao obter produtos!' + error)
        })
})

router.get('/withCategories', (req, res) => {
    productController.getProductsWithCategories()
        .then((productsData) => {
            res.json(productsData)
        })
        .catch((error) => {
            res.status(500).send('Erro ao obter produtos com categorias!')
        })
})

router.get('/:id', (req, res) => {
    productController.getProductsById(req.params.id)
        .then((productData) => {
            if(productData){
                res.status(200).send(productData)
            } else {
                res.status(404).send('Produto não encontrado!')
            }
        })
        .catch((error) => {
            res.status(500).send('Erro ao obter produtos!' + error)
        })

})

// router.post('/', upload.single('product_image'), (req, res) => {
router.post('/', (req, res) => {
    // const product_image = req.file.filename;
    
    console.log(req.body)
    
    const {
        product_title, 
        product_price,
        product_description,
        product_image,
        product_rate,
        product_count,
        category_id
    } = req.body;
    
    productController.createProduct(
        product_title, 
        product_price,
        product_description,
        product_image,
        product_rate,
        product_count,
        category_id
       
    )
    .then((result)=>{
        res.status(201).json({message: 'Produto criado com sucesso! ',  product_id: result.insertId})
    })
    .catch((error) =>{
        res.status(500).send("Erro ao criar produto! Detalhes: " + error);
    })
})


module.exports = router;