const Tag = require('../models/Tag')
const Author = require('../models/Author')
const Article = require('../models/Article')
const ImageUrl = require('../models/ImageUrl')
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
              title: "RnB | Dashboard",
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
              title: "RnB | Articles",
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
            title: "RnB | Articles",
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
            title: "RnB | Articles",
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
            title: "RnB | Articles",
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
              title: "RnB | Authors",
            });
          } catch (error) {
            res.redirect("/admin/dashboard");
          }
    },
    addAuthorsView : (req,res) =>{
      try {
          res.render("admin/authors/add_authors", {
            title: "RnB | Authors",
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
            title: "RnB | Authors",
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
              title: "RnB | Tags",
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
              title: "RnB | Tags",
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
          title: "RnB | Tags",
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
            title: "RnB | Images",
          });
        } catch (error) {
          res.redirect("/admin/dashboard");
        }
  },
  addImagesView : (req,res) =>{
    try {
        res.render("admin/images/add_images", {
          title: "RnB | Images",
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

}