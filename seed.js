var seeder = require('mongoose-seed');

// Connect to MongoDB via Mongoose
seeder.connect('mongodb://127.0.0.1:27017/db_mainlancongyok', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true
}, function () {

  // Load Mongoose models
  seeder.loadModels([
    './models/Image'
  ]);

  // Clear specified collections
  seeder.clearModels(['Image'], function () {

    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });

  });
});

var data = [
  {
    'model': 'Image',
    'documents': [
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc901111'),
        imageUrl: 'miminlancong.com',
      },
      {
        _id: mongoose.Types.ObjectId('5e96cbe292b97300fc901112'),
        imageUrl: 'miminlancong.co.id',
      },
    ]
  }
];