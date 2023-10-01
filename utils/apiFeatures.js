class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword, // mongoDB opeartor
                $options: "i", // case-insensitive
            }
        } : {};
        this.query = this.query.find({...keyword });
        return this;
    }
    filter() {
        // const queryCopy=this.queryStr; --> WRONG because this.queryStr is an object and in JS, these are passed through Reference
        const queryCopy = {...this.queryStr };
        const removeFields = ["keyword", "page", "limit"];
        // For Category
        removeFields.forEach(key => delete queryCopy[key]);
        // For Price 
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`); ///\b()\b/g

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resultsPerPage) {
        const currentPage = Number(this.queryStr.page) || 1; // this.queryStr.page --> String, Convert it into a Number
        const skip = (currentPage - 1) * resultsPerPage;
        this.query = this.query.limit(resultsPerPage).skip(skip); // using limit() query
        return this;
    }
}

module.exports = ApiFeatures;