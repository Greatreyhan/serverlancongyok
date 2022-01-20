const router = require('express').Router()
const AdminController = require('../controllers/adminController')
const {uploadSingle, uploadMultiple} = require('../middlewares/multer')
const auth = require('../middlewares/auth')

// endpoint login
router.get('/login', AdminController.viewLogin)
router.post('/login', AdminController.actionLogin)

// verify user Session
router.use(auth)

// endpoint logout
router.get('/logout', AdminController.actionLogout)

// endpoint dashboard
router.get('/dashboard', AdminController.viewDashboard)

// endpoint articles
router.get('/articles', AdminController.viewArticles)
router.get('/articles/add', AdminController.addArticlesView)
router.post('/articles/add', uploadSingle, AdminController.addArticlesAction)
router.get('/articles/edit/:articleid', AdminController.editArticlesView)
router.delete('/articles/delete/:articleid', AdminController.deleteArticles)
router.put('/articles/edit', uploadSingle, AdminController.editArticlesAction)
router.get('/articles/detail/:articleid', AdminController.viewDetailArticles)

// endpoint authors
router.get('/authors', AdminController.viewAuthors)
router.get('/authors/add', AdminController.addAuthorsView)
router.post('/authors/add', uploadSingle, AdminController.addAuthorsAction)
router.get('/authors/edit/:authorsid', AdminController.editAuthorsView)
router.put('/authors/edit', uploadSingle, AdminController.editAuthorsAction)
router.delete('/authors/delete/:authorid', AdminController.deleteAuthors)

// endpoint tags
router.get('/tags', AdminController.viewTags)
router.get('/tags/add', AdminController.addTagsView)
router.post('/tags/add', AdminController.addTagsAction)
router.get('/tags/edit/:tagid', AdminController.editTagsView)
router.put('/tags/edit', AdminController.editTagsAction)
router.delete('/tags/delete/:tagid',AdminController.deleteTagsAction)

// endpoint images
router.get('/images', AdminController.viewImages)
router.get('/images/add', AdminController.addImagesView)
router.post('/images/add', uploadSingle, AdminController.addImagesAction)
router.delete('/images/delete/:imageid',AdminController.deleteImages)

// endpoint category
router.get('/category', AdminController.viewCategory)
router.get('/category/add', AdminController.addCategoryView)
router.post('/category/add', AdminController.addCategoryAction)
router.get('/category/edit/:categoryid', AdminController.editCategoryView)
router.put('/category/edit', AdminController.editCategoryAction)
router.delete('/category/delete/:categoryid',AdminController.deleteCategoryAction)

// endpoint bank
router.get('/bank', AdminController.viewBank)
router.get('/bank/add', AdminController.addBankView)
router.post('/bank/add', uploadSingle, AdminController.addBankAction)
router.delete('/bank/delete/:bankid',AdminController.deleteBank)

// endpoint item
router.get('/item', AdminController.viewItem)
router.get('/item/add', AdminController.addItemView)
router.post('/item/add', uploadMultiple, AdminController.addItemAction)
router.get('/item/images/:itemid', AdminController.showItemImage)
router.get('/item/edit/:itemid', AdminController.editItemView)
router.put('/item/edit', uploadMultiple, AdminController.editItemAction)
router.delete('/item/delete/:itemid',AdminController.deleteItem)

// endpoint feature
router.get('/item/feature/:itemid', AdminController.viewFeature)
router.get('/item/feature/add/:itemid', AdminController.addFeatureView)
router.post('/item/feature/add',uploadSingle, AdminController.addFeatureAction)
router.delete('/item/feature/delete/:featureid',AdminController.deleteFeature)

// endpoint activity
router.get('/item/activity/:itemid', AdminController.viewActivity)
router.get('/item/activity/add/:itemid', AdminController.addActivityView)
router.post('/item/activity/add',uploadSingle, AdminController.addActivityAction)
router.delete('/item/activity/delete/:activityid',AdminController.deleteActivity)

// endpoint user
router.post('/generator/user', AdminController.newUser)

module.exports = router;