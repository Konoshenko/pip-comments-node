let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { PostV1 } from '../data/v1/PostV1';
import { IPostsPersistence } from './IPostsPersistence';

export class PostsMemoryPersistence
    extends IdentifiableMemoryPersistence<PostV1, string>
    implements IPostsPersistence {

    constructor() {
        super();
        this._maxPageSize = 1000;
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let status = filter.getAsNullableString('status');
        let author_id = filter.getAsNullableString('author_id');
        let authorIds = filter.getAsObject('author_ids');
        if (_.isString(authorIds))
        authorIds = authorIds.split(',');
        if (!_.isArray(authorIds))
        authorIds = null;

        return (item) => {
            if (id != null && item.id != id)
                return false;
             if (status != null && item.status != status)
                 return false;
            if (author_id != null && item.author_id != author_id)
                return false;
            if (authorIds != null && _.indexOf(authorIds, item.author_id) < 0)
                return false;
            return true;
        };
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getOneById(correlationId: string, id: string,
        callback: (err: any, item: PostV1) => void): void {
        
        let item = _.find(this._items, (item) => item.id == id);

        if (item != null) this._logger.trace(correlationId, "Found post by %s", id);
        else this._logger.trace(correlationId, "Cannot find beacon by %s", id);

        callback(null, item);
    }


}