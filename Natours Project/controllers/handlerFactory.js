const AppError = require('../utils/appError');

exports.findByIdAndUpdate = async (model, id, data, options) => {
  try {
    const updatedDoc = await model.findByIdAndUpdate(id, data, options);
    if (!updatedDoc) {
      throw new AppError('No document found to update', 404);
    }
    return updatedDoc;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

exports.deleteById = async (model, id) => {
  try {
    const data = await model.findByIdAndDelete(id);
    if (data) {
      return data;
    } else {
      throw new AppError('Data Not Found', 404);
    }
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

exports.findById = async (model, id, populateOptions) => {
  try {
    let query = model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) {
      throw new AppError('No document found', 404);
    }
    return doc;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

exports.createDocs = async (model, data) => {
  try {
    const savedData = await model.create(data);
    return savedData;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

exports.getDocsByAggregatePipeline = async (model, filter) => {
  try {
    const filteredData = await model.aggregate(filter);
    if (!filteredData) {
      throw new AppError('No documents found', 404);
    }
    return filteredData;
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};
exports.getAllDocs = async (model) => {
  try {
    const data = await model.find();
    if (data) {
      return data;
    } else {
      throw new AppError('Data Not Found', 404);
    }
  } catch (err) {
    throw new AppError(err.message, 500);
  }
};

exports.getDocs = async (model,filter) =>{
  try{
    const data = await model.find(filter);
    return data
  }
  catch (err) {
    throw new AppError(err.message, 500);
  }
}
//exports.findByIdAnd
