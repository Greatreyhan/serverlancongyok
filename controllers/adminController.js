const Tag = require('../models/Tag')
const Author = require('../models/Author')
const Article = require('../models/Article')
const ImageUrl = require('../models/ImageUrl')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Item = require('../models/Item')
const Image = require('../models/Image')
const Feature = require('../models/Feature')
const Activity = require('../models/Activity')
const fs = require('fs-extra');
const path = require('path');
module.exports = {
    viewDashboard : async (req,res) =>{
        try {
            const articles = await Article.find();
            const authors = await Author.find();
            const images = await ImageUrl.find();
            const tags = await Tag.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/dashboard/view_dashboard', {
              articles,
              authors,
              images,
              tags,
              alert,
              title: "Lancongyok | Dashboard",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },

  // -------------------------- ARTICLES ----------------------------------------//
    viewArticles : async (req,res) =>{
        try {
            const articles = await Article.find()
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/articles/view_articles', {
              articles,
              alert,
              title: "Lancongyok | Articles",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },
    addArticlesView : async (req,res) =>{
      try {
          const tags = await Tag.find();
          const authors = await Author.find();
          res.render("admin/articles/add_articles", {
            tags,
            authors,
            title: "Lancongyok | Articles",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addArticlesAction: async (req, res) => {
      try {
        const { title, contentEditor, description, authorId, tagId } = req.body;
        const author = await Author.findOne({_id : authorId})
        const tag = await Tag.findOne({_id : tagId})
        const newArticle = {
          title,
          content : contentEditor,
          date : new Date(),
          description,
          authorId : author._id,
          tagId : tag._id,
          imageUrl: `images/${req.file.filename}`,
        };
        const article = await Article.create(newArticle)
        author.articleId.push({_id : article._id})
        await author.save();
        tag.articleId.push({_id : article._id})
        await tag.save();
        req.flash("alertMessage", `Success create field ${title}`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/articles");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/articles");
      }
    },
    editArticlesView : async (req,res) =>{
      try {
          const {articleid} = req.params;
          const authors = await Author.find();
          const tags = await Tag.find();
          const article = await Article.findOne({_id : articleid}).populate('authorId')
          res.render("admin/articles/edit_articles", {
            articleid,
            tags,
            article,
            authors,
            title: "Lancongyok | Articles",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    editArticlesAction: async (req, res) => {
      const { title, contentEditor, description, authorId, tagId, articleId } = req.body;
      try {
        const article = await Article.findOne({_id : articleId})
        const author = await Author.findOne({_id : authorId})
        const tag = await Tag.findOne({_id : tagId})
        if(req.file == undefined){
          article.title = title;
          article.content = contentEditor;
          article.description = description;
          article.authorId = authorId;
          article.tagId = tagId;
          await article.save();
          req.flash("alertMessage", `Success update field ${title}`);
          req.flash("alertStatus", "success");
          res.redirect("/admin/articles");
        }
        else{
          await fs.unlink(path.join(`public/${article.imageUrl}`));
          article.title = title;
          article.content = contentEditor;
          article.description = description;
          article.authorId = authorId;
          article.tagId = tagId;
          article.imageUrl = `images/${req.file.filename}`;
          await article.save();
          req.flash("alertMessage", `Success update field ${title}`);
          req.flash("alertStatus", "success");
          res.redirect("/admin/articles");
        }
        
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/articles");
      }
    },
    deleteArticles : async (req,res) =>{
      try{
        const {articleid} = req.params;
        const article = await Article.findOne({_id: articleid})
        await fs.unlink(path.join(`public/${article.imageUrl}`));
        await article.remove()
        req.flash("alertMessage", `Success Remove Article`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/articles");
      }
      catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/articles");
      }
    },
    viewDetailArticles : async (req,res) =>{
      try {
          const {articleid} = req.params;
          const article = await Article.findOne({_id:articleid})
          const alertMessage = req.flash("alertMessage");
          const alertStatus = req.flash("alertStatus");
          const alert = { message: alertMessage, status: alertStatus };
          res.render('admin/articles/detail_articles', {
            article,
            alert,
            title: "Lancongyok | Articles",
          });
        } catch (error) {
          res.redirect("/admin/articles");
        }
  },

    // -------------------------- AUTHORS ----------------------------------------//
    viewAuthors : async (req,res) =>{
        try {
            const authors = await Author.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render('admin/authors/view_authors', {
              authors,
              alert,
              title: "Lancongyok | Authors",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },
    addAuthorsView : (req,res) =>{
      try {
          res.render("admin/authors/add_authors", {
            title: "Lancongyok | Authors",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addAuthorsAction: async (req, res) => {
      try {
        const { name, occupation, city, instagram, twitter, linkedin } = req.body;
        await Author.create({
          name,
          occupation,
          city,
          instagram,
          twitter,
          linkedin,
          imageUrl: `images/${req.file.filename}`,
        });
        req.flash("alertMessage", `Success create field ${name}`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/authors");
      } catch (error) {
        req.flash("alertMessage", `$error.message`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/authors");
      }
    },
    editAuthorsView : async (req,res) =>{
      try {
        const {authorsid} = req.params;
        const author = await Author.findOne({_id : authorsid});
          res.render("admin/authors/edit_authors", {
            author,
            title: "Lancongyok | Authors",
          });
        } catch (error) {
          res.redirect("/admin/authors");
        }
    },
    editAuthorsAction: async (req, res) => {
      const { name, occupation, city, instagram, twitter, linkedin, authorid } = req.body;
      try {
        const author = await Author.findOne({_id : authorid})
        if(req.file == undefined){
          author.name = name;
          author.occupation = occupation;
          author.city = city;
          author.instagram = instagram;
          author.twitter = twitter;
          author.linkedin = linkedin;
          await author.save();
          req.flash("alertMessage", `Success update field ${name}`);
          req.flash("alertStatus", "success");
          res.redirect("/admin/authors");
        }
        else{
          await fs.unlink(path.join(`public/${author.imageUrl}`));
          author.name = name;
          author.occupation = occupation;
          author.city = city;
          author.instagram = instagram;
          author.twitter = twitter;
          author.linkedin = linkedin;
          author.imageUrl = `images/${req.file.filename}`;
          await author.save();
          req.flash("alertMessage", `Success update field ${name}`);
          req.flash("alertStatus", "success");
          res.redirect("/admin/authors");
        }
        
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/authors");
      }
    },
    deleteAuthors : async (req,res) =>{
      try{
        const {authorid} = req.params;
        const author = await Author.findOne({_id: authorid})
        await fs.unlink(path.join(`public/${author.imageUrl}`));
        await author.remove()
        req.flash("alertMessage", `Success Remove Author`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/authors");
      }
      catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/authors");
      }
    },

    // -------------------------- TAGS ----------------------------------------//

    viewTags : async (req,res) =>{
        try {
            const tags = await Tag.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render("admin/tags/view_tags", {
              alert,
              tags,
              title: "Lancongyok | Tags",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },
    addTagsView : (req,res) =>{
        try {
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render("admin/tags/add_tags", {
              alert,
              title: "Lancongyok | Tags",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },
    addTagsAction : async (req,res) =>{
      try {
        const { name } = req.body;
        await Tag.create({ name });
        req.flash("alertMessage", "Success Add Tag");
        req.flash("alertStatus", "success");
        res.redirect("/admin/tags");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/tags");
      }
    },
    editTagsView : async (req,res) =>{
      try {
        const {tagid} = req.params;
        const tag = await Tag.findOne({_id : tagid})
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        res.render("admin/tags/edit_tags", {
          alert,
          tag,
          title: "Lancongyok | Tags",
        });
      } catch (error) {
        res.redirect("/admin/dashboard");
      }
    },
    editTagsAction : async (req,res) =>{
      try {
        const { name, id } = req.body;
        const tag = await Tag.findOne({_id : id})
        tag.name = name;
        await tag.save();
        req.flash("alertMessage", "Success Edit Tag");
        req.flash("alertStatus", "success");
        res.redirect("/admin/tags");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/tags");
      }
    },
    deleteTagsAction : async (req,res) =>{
      try {
        const {tagid} = req.params;
        const tag = await Tag.findOne({_id:tagid})
        await tag.remove();
        req.flash("alertMessage", "Success Delete Tag");
        req.flash("alertStatus", "success");
        res.redirect("/admin/tags");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/tags");
      }
    },


    // -------------------------- IMAGES ----------------------------------------//

    viewImages : async (req,res) =>{
        try {
            const images = await ImageUrl.find();
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render("admin/images/view_images", {
              images,
              alert,
              title: "Lancongyok | Images",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },
    addImagesView : (req,res) =>{
      try {
          res.render("admin/images/add_images", {
            title: "Lancongyok | Images",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addImagesAction: async (req, res) => {
      try {
        const { title } = req.body;
        await ImageUrl.create({
          imageLink: `images/${req.file.filename}`,
          title,
          date: new Date()
        });
        req.flash("alertMessage", `Success create field ${title}`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/images");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/images");
      }
    },
    deleteImages : async (req,res) =>{
      try{
        const {imageid} = req.params;
        const image = await ImageUrl.findOne({_id: imageid})
        await fs.unlink(path.join(`public/${image.imageLink}`));
        await image.remove()
        req.flash("alertMessage", `Success Remove Image`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/images");
      }
      catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/images");
      }
    },

      // -------------------------- CATEGORY ----------------------------------------//

    viewCategory : async (req,res) =>{
        try {
            const categories = await Category.find()
            const alertMessage = req.flash("alertMessage");
            const alertStatus = req.flash("alertStatus");
            const alert = { message: alertMessage, status: alertStatus };
            res.render("admin/category/view_categories", {
              alert,
              categories,
              title: "Lancongyok | Category",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },
    addCategoryView : (req,res) =>{
      try {
          res.render("admin/category/add_categories", {
            title: "Lancongyok | Category",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addCategoryAction : async (req,res) =>{
      try {
        const { name } = req.body;
        await Category.create({ name });
        req.flash("alertMessage", "Success Add Tag");
        req.flash("alertStatus", "success");
        res.redirect("/admin/category");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/category");
      }
    },
    editCategoryView : async (req,res) =>{
      try {
        const {categoryid} = req.params;
        const category = await Category.findOne({_id : categoryid})
        const alertMessage = req.flash("alertMessage");
        const alertStatus = req.flash("alertStatus");
        const alert = { message: alertMessage, status: alertStatus };
        res.render("admin/category/edit_categories", {
          alert,
          category,
          title: "Lancongyok | Category",
        });
      } catch (error) {
        res.redirect("/admin/dashboard");
      }
    },
    editCategoryAction : async (req,res) =>{
      try {
        const { name, id } = req.body;
        const category = await Category.findOne({_id : id})
        category.name = name;
        await category.save();
        req.flash("alertMessage", "Success Edit Tag");
        req.flash("alertStatus", "success");
        res.redirect("/admin/category");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/category");
      }
    },
    deleteCategoryAction : async (req,res) =>{
      try {
        const {categoryid} = req.params;
        const category = await Category.findOne({_id:categoryid})
        await category.remove();
        req.flash("alertMessage", "Success Delete Tag");
        req.flash("alertStatus", "success");
        res.redirect("/admin/category");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/category");
      }
    },

    // -------------------------- BANK ----------------------------------------//

    viewBank : async (req,res) =>{
      try {
          const bank = await Bank.find()
          const alertMessage = req.flash("alertMessage");
          const alertStatus = req.flash("alertStatus");
          const alert = { message: alertMessage, status: alertStatus };
          res.render("admin/bank/view_bank", {
            bank,
            alert,
            title: "Lancongyok | Bank",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addBankView : (req,res) =>{
      try {
          res.render("admin/bank/add_bank", {
            title: "Lancongyok | Bank",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addBankAction: async (req, res) => {
      try {
        const { nameBank, nomorRekening, name } = req.body;
        await Bank.create({
          nameBank,
          nomorRekening,
          name,
          imageUrl: `images/${req.file.filename}`,
        });
        req.flash("alertMessage", `Success create field`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/bank");
      }
    },
    deleteBank : async (req,res) =>{
      try{
        const {bankid} = req.params;
        const bank = await Bank.findOne({_id: bankid})
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        await bank.remove()
        req.flash("alertMessage", `Success Remove Field`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
      catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/bank");
      }
    },

    // -------------------------- Item ----------------------------------------//
    viewItem : async (req,res) =>{
      try {
          const items = await Item.find().populate({path:'categoryId', select: 'id name'});
          const alertMessage = req.flash("alertMessage");
          const alertStatus = req.flash("alertStatus");
          const alert = { message: alertMessage, status: alertStatus };
          res.render("admin/item/view_item", {
            items,
            alert,
            title: "Lancongyok | item",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addItemView : async (req,res) =>{
      try {
          const categories = await Category.find()
          res.render("admin/item/add_item", {
            categories,
            title: "Lancongyok | Item",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addItemAction : async (req,res) =>{
      try {
        const {categoryId, title, price, city, country, description } = req.body;
        if(req.files.length > 0){
          const category = await Category.findOne({_id: categoryId});
          const newItem = {
            title,
            price,
            city,
            country,
            description,
            categoryId: category._id
          }
          const item = await Item.create(newItem);
          category.itemId.push({_id: item._id});
          await category.save();
          for(let i = 0; i < req.files.length ; i++ ){
            const imageSave = await Image.create({imageUrl: `images/${req.files[i].filename}`});
            item.imageId.push({_id: imageSave._id});
            await item.save();
          }
        req.flash("alertMessage", `Success create item ${title}`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
        }
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }
    },
    showItemImage : async (req,res) =>{
      try{
        const {itemid} = req.params;
        const items = await Item.findOne({_id:itemid})
        .populate({path : 'imageId', select: 'id imageUrl'})
        res.render("admin/item/view_images", {
          items,
          title: "Lancongyok | Item Image",
          action: 'show images'
        });
  
      }
      catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/items");
      }
    },
    editItemView : async(req,res) =>{
      try {
        const {itemid} = req.params;
        const categories = await Category.find();
        const item = await Item.findOne({_id:itemid})
        .populate({path : 'imageId', select: 'id imageUrl'})
        .populate({path : 'categoryId', select: 'id name'})
        res.render("admin/item/edit_item", {
          item,
          title: "Lancongyok | Show Edit Item",
          categories
        });
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }
    },
    editItemAction : async(req,res) =>{
      try {
        const {categoryId, title, price, city, country, description, itemid} = req.body;
        const item = await Item.findOne({_id: itemid})
        .populate({path: 'imageId', select: 'id imageUrl'})
        .populate({path: 'categoryId', select: 'id name'});
  
        if(req.files.length > 0){
          for(let i = 0; i < item.imageId.length ; i++){
            Image.findOne({_id: item.imageId[i]._id})
            .then(async (image)=>{
                await fs.unlink(path.join(`public/${image.imageUrl}`));
                image.remove();
            })
            .catch(error=>{
              req.flash("alertMessage", `${error.message}`);
              req.flash("alertStatus", "danger");
              res.redirect("/admin/item");
            })
          }
          for(let i = 0; i < req.files.length ; i++ ){
            const imageSave = await Image.create({imageUrl: `images/${req.files[i].filename}`});
            item.imageId.push({_id: imageSave._id});
            await item.save();
          }
          item.title = title;
          item.price = price;
          item.city = city;
          item.country = country;
          item.description = description;
          item.categoryId =  categoryId;
          await item.save();
          req.flash("alertMessage", `Success edit item ${title}`);
          req.flash("alertStatus", "success");
          res.redirect("/admin/item");
        }
        else{
          item.title = title;
          item.price = price;
          item.city = city;
          item.country = country;
          item.description = description;
          item.categoryId =  categoryId;
          await item.save();
          req.flash("alertMessage", `Success edit item ${about}`);
          req.flash("alertStatus", "success");
          res.redirect("/admin/item");
        }
      } catch(error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }
    },
    deleteItem : async(req,res) =>{
      try {
        const {itemid} = req.params;
        const item = await Item.findOne({_id: itemid})
        .populate('imageId');
        for(let i = 0; i < item.imageId.length ; i++){
          Image.findOne({_id: item.imageId[i]._id})
          .then(async (image)=>{
              await fs.unlink(path.join(`public/${image.imageUrl}`));
              image.remove();
          })
          .catch(error=>{
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "danger");
            res.redirect("/admin/item");
          })
        }
        await item.remove();
        req.flash("alertMessage", `Success delete item `);
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }
    },

    // -------------------------- Feature ----------------------------------------//
    viewFeature : async (req,res) =>{
      try {
          const {itemid} = req.params
          const item = await Item.findOne({_id : itemid}).populate('featureId')
          const alertMessage = req.flash("alertMessage");
          const alertStatus = req.flash("alertStatus");
          const alert = { message: alertMessage, status: alertStatus };
          res.render("admin/feature/view_feature", {
            item,
            alert,
            title: "Lancongyok | Feature",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addFeatureView : async (req,res) =>{
      try {
          const {itemid} = req.params
          res.render("admin/feature/add_feature", {
            itemid,
            title: "Lancongyok | Feature",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addFeatureAction: async (req, res) => {
      const { name, qty, itemid } = req.body;
      try {
        const item = await Item.findOne({_id : itemid})
        const feature = await Feature.create({
          name,
          qty,
          itemId : item._id,
          imageUrl: `images/${req.file.filename}`,
        });
        item.featureId.push({_id: feature._id})
        await item.save()
        req.flash("alertMessage", `Success create ${name,qty,itemid}`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/feature/${itemid}`);
      } catch (error) {
        req.flash("alertMessage", `${name,qty,itemid}`);
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/feature/${itemid}`);
      }
    },
    deleteFeature : async (req,res) =>{
      try{
        const {featureid} = req.params;
        const feature = await Feature.findOne({_id: featureid}).populate({path:'itemId',select:'id'})
        const item = await Item.findOne({_id: feature.itemId._id}).populate({path:'featureId', select:'id'})
        let newFeature = [];
        for(let i = 0; i < item.featureId.length; i++){
          if(item.featureId[i]._id.toString() != feature._id.toString()){
            newFeature.push({_id: item.featureId[i]._id})
          }
        }
        item.featureId = newFeature
        await item.save()
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        await feature.remove()
        req.flash("alertMessage", `Success Remove Field`);
        req.flash("alertStatus", "success");
        res.redirect("/admin/item");
      }
      catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }
    },

    // -------------------------- Activity ----------------------------------------//
    viewActivity : async (req,res) =>{
      try {
          const {itemid} = req.params
          const item = await Item.findOne({_id : itemid}).populate('activityId')
          const alertMessage = req.flash("alertMessage");
          const alertStatus = req.flash("alertStatus");
          const alert = { message: alertMessage, status: alertStatus };
          res.render("admin/activity/view_activity", {
            itemid,
            item,
            alert,
            title: "Lancongyok | Activity",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addActivityView : async (req,res) =>{
      try {
          const {itemid} = req.params
          res.render("admin/activity/add_activity", {
            itemid,
            title: "Lancongyok | Activity",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
    },
    addActivityAction: async (req, res) => {
      const { name, type, itemid } = req.body;
      try {
        const item = await Item.findOne({_id : itemid})
        const activity = await Activity.create({
          name,
          type,
          imageUrl: `images/${req.file.filename}`,
          isPopular : false,
          itemId : item._id,
          
        });
        item.activityId.push({_id: activity._id})
        await item.save()
        console.log(item)
        req.flash("alertMessage", `Success create field`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/activity/${itemid}`);
      } catch (error) {
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect(`/admin/item/activity/${itemid}`);
      }
    },
    deleteActivity : async (req,res) =>{
      try{
        const {activityid} = req.params;
        const activity = await Activity.findOne({_id: activityid}).populate({path:'itemId',select:'id'})
        const item = await Item.findOne({_id: activity.itemId._id}).populate({path:'activityId', select:'id'})
        let newActivity = [];
        for(let i = 0; i < item.activityId.length; i++){
          if(item.activityId[i]._id.toString() != activity._id.toString()){
            newActivity.push({_id: item.activityId[i]._id})
          }
        }
        item.activityId = newActivity
        await item.save()
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        await activity.remove()
        req.flash("alertMessage", `Success Remove Field`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/item/activity/${item._id}`);
      }
      catch(error){
        req.flash("alertMessage", `${error.message}`);
        req.flash("alertStatus", "danger");
        res.redirect("/admin/item");
      }
    },
}

