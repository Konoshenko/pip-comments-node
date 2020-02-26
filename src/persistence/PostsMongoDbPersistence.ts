let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { PostV1 } from '../data/v1/PostV1';
import { IPostsPersistence } from './IPostsPersistence';
import { PostsMongoDbSchema } from './PostMongoDbSchema';

export class PostsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<PostV1, string>
    implements IPostsPersistence {
    
    constructor() {
        super("posts");
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        let id = filter.getAsNullableString('id');
        if (id != null) 
            criteria.push({ _id: id });

        let authorId = filter.getAsNullableString('author_id');
        if (authorId != null)
            criteria.push({ author_id: authorId });

        let status = filter.getAsNullableString('status');
        if (status != null)
            criteria.push({ status: status });

        let authorIds = filter.getAsObject('author_ids');
        if (_.isString(authorIds))
        authorIds = authorIds.split(',');
        if (_.isArray(authorIds))
            criteria.push({ author_id: { $in: authorIds } });

        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getOneByUdi(correlationId: string, id: string,
        callback: (err: any, item: PostV1) => void): void {

        let criteria = {
            id: id
        };

        this._client._model.findOne(criteria, (err, item) => {
            item = this.convertFromPublic(item);

            if (item != null) this._logger.trace(correlationId, "Found post by %s", id);
            else this._logger.trace(correlationId, "Cannot find beacon by %s", id);

            callback(err, item);
        });
    }
}