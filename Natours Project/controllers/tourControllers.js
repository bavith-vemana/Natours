const qs = require('qs');
const { tourModel } = require('../models/tourModel');
const { queryParser } = require('../utils/apiFeatures');
const handlerFactory = require('../controllers/handlerFactory');
const AppError = require('../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

// const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`));
const checkID = (req, res, next, val) => {
  next();
};

const getAllTours = async (req, res, next) => {
  try {
    let filters = { ...qs.parse(req._parsedUrl.query) };
    //remove these fileds
    const excludedFields = [];
    const query = queryParser(filters, excludedFields);
    //use await after chaining every thing
    const toursData = await query;

    res.status(202).json({
      status: 'success',
      result: toursData.length,
      data: toursData,
    });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err });
  }
};

const updateTourPics = () => {
  const storage = multer.memoryStorage();
  const filter = (req, file, callback) => {
    const types = ['png', 'jpg', 'jpeg'];
    const ext = file.mimetype.split('/')[1];
    if (types.includes(ext)) {
      callback(null, true);
    } else {
      callback(
        new AppError('Please upload only png,jpg & jpeg formats only!', 400),
      );
    }
  };
  const upload = multer({ storage: storage, fileFilter: filter }).array(
    'images',
    3,
  );
  return upload;
};

const resizeTourPics = async (req, res, next) => {
  try {
    const data = req.files;
    if (!data) {
      return next(new AppError('no Images found', 500));
    }
    if (data.length > 3) {
      return next(new AppError('max 3 images are allowes', 500));
    }
    await Promise.all(
      data.map(async (element, i) => {
        const ext = element.mimetype.split('/')[1];
        const filename = `tour-${req.params.id}-${i + 1}.${ext}`;
        await sharp(element.buffer)
          .resize(1000, 667)
          .toFile(`public/img/tours/${filename}`);
        element.filename = filename;
      }),
    );
    next();
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const updateTour = async (req, res, next) => {
  try {
    const photosData = req.files;
    let images = [];
    photosData.forEach((element) => {
      images.push(element.filename);
    });
    const id = req.params.id;
    req.body.images = images;
    const data = req.body;
    const options = { new: true, runValidators: true };
    const updatedDoc = await handlerFactory.findByIdAndUpdate(
      tourModel,
      id,
      data,
      options,
    );
    res.status(200).json({ status: 'Sucess', data: updatedDoc });
  } catch (err) {
    next(err);
  }
};

const deleteTour = async (req, res, next) => {
  try {
    const data = await handlerFactory.deleteById(tourModel, req.params.id);
    res.status(200).json({ status: 'Sucess', deletedData: data });
  } catch (err) {
    next(err);
  }
};

const getTour = async (req, res, next) => {
  try {
    const doc = await handlerFactory.findById(
      tourModel,
      req.params.id,
      'Reviews',
    );
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  } catch (err) {
    next(err);
  }
};

const getTourWithin = async (req, res, next) => {
  try {
    let { location, radius, unit } = req.query;

    // Parse location as JSON (e.g. "[lat,lng]" → [40.95, -121.61])
    const [lat, lng] = JSON.parse(location);

    // Convert to numbers
    const latitude = Number(lat);
    const longitude = Number(lng);
    let rad;

    // Convert distance to radians
    if (unit === 'miles') {
      rad = Number(radius) / 3963.2;
    } else {
      // default km
      rad = Number(radius) / 6378.1;
    }

    const tours = await tourModel.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[longitude, latitude], rad] },
      },
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const distances = async (req, res, next) => {
  try {
    let { location, radius, unit } = req.query;

    // Parse location as JSON (e.g. "[lat,lng]" → [40.95, -121.61])
    const [lat, lng] = JSON.parse(location);
    if (!lat || !lng) {
      return next(new AppError('please provide lat,lng', 400));
    }

    // Convert to numbers
    const latitude = Number(lat);
    const longitude = Number(lng);
    const distances = await tourModel.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
            distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001,
          },
          distanceField: 'distance', // field name to store calculated distance
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      results: distances.length,
      data: distances,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const createTour = async (req, res, next) => {
  try {
    const data = req.body;
    const Doc = await handlerFactory.createDocs(tourModel, data);
    res.status(200).json({ status: 'Sucess', savedData: Doc });
  } catch (err) {
    next(err);
  }
};

const getTourStats = async (req, res, next) => {
  try {
    const filter = [
      {
        $group: {
          _id: '$difficulty',
          NoofTours: { $sum: 1 },
          AvgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
        },
      },
    ];
    const Doc = await handlerFactory.getDocsByAggregatePipeline(
      tourModel,
      filter,
    );
    res.status(200).json({ status: 'Sucess', data: Doc });
  } catch (err) {
    next(err);
  }
};

const monthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);
    const dat = await tourModel.aggregate([
      { $unwind: '$startDate' },
      {
        $match: {
          $expr: { $eq: [{ $year: '$startDate' }, year] },
        },
      },
      {
        $group: {
          _id: '$name', // group by tour name
          Avgduration: { $avg: '$duration' }, // keep one duration (same for tour)
          startDates: { $push: '$startDate' }, // merge all startDates into array
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          Avgduration: 1,
          startDates: 1,
        },
      },
    ]);
    if (dat.length === 0) {
      res.status(400).json({ status: 'failed', message: 'No data found' });
    } else {
      res.status(200).json({ start_year: year, data: dat });
    }
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err });
  }
};

module.exports = {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  checkID,
  getTourStats,
  monthlyPlan,
  getTourWithin,
  distances,
  updateTourPics,
  resizeTourPics,
};
