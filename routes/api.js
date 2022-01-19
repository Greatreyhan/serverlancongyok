const router = require('express').Router()
const apiController = require('../controllers/apiController')

// endpoint article
router.get('/articles/:articleid', apiController.getDetailArticle)
router.get('/articles-menu', apiController.getArticlesMenu)
router.get('/articles-trending', apiController.getTrendingArticles)
router.get('/tags', apiController.getTags)
router.get('/tags/:tagid', apiController.getArticlesByTag)


module.exports = router