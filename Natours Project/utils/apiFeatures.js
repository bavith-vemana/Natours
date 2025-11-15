const { tourModel } = require('../models/tourModel');
const queryParser = (filters, excludedFields) => {
  // Remove excluded fields from filters
  //filtering(removing certain feilds in Query)
  if (excludedFields.length > 0) {
    excludedFields.forEach((field) => delete filters[field]);
  }
  let stringifiedFilter = JSON.stringify(filters);

  //advance filtering(lte,gte,gt,lt)
  stringifiedFilter = stringifiedFilter.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );
  filters = JSON.parse(stringifiedFilter);
  //sorting
  let sortKey = null;
  if (filters.sort) {
    sortKey = filters.sort;
    if (sortKey.includes(',')) {
      sortKey = sortKey.replaceAll(',', ' ');
    }
    delete filters.sort;
  }

  //selecting fields
  let selectFields = null;
  if (filters.fields) {
    selectFields = filters.fields;
    if (selectFields.includes(',')) {
      selectFields = selectFields.replaceAll(',', ' ');
    }
    delete filters.fields;
  }

  //pagination
  let pagination = false;
  let skip = 0;
  let limit = 0;
  if (filters.page || filters.limit) {
    let { page, limit } = filters;
    page = parseInt(page, 10) || 1; //default page=1
    limit = parseInt(limit, 10) || 10; // default limit = 10
    skip = (page - 1) * limit;
    pagination = true;
    delete filters.page;
    delete filters.limit;
  }
  //final query
  let query = tourModel;
  if (filters) {
    query = query.find(filters);
  }
  if (sortKey) {
    query = query.sort(sortKey);
  }
  if (selectFields) {
    query = query.select(selectFields);
  }
  if (pagination) {
    query = query.skip(skip).limit(limit);
  }
  return query;
};


class apiFeatures {
    constructor(filters){

    }
}
module.exports = { queryParser };
