const router = require('express').Router()
const AdminController = require('../controllers/adminController')
const {uploadSingle, uploadMultiple} = require('../middlewares/multer')

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

module.exports = router;