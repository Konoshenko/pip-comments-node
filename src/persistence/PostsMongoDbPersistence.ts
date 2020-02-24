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
        //base("mydata", new PostsMongoDbSchema());
        
    
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let criteria = [];

        /*let id = filter.getAsNullableString('id');
        if (id != null) 
            criteria.push({ _id: id });

        let siteId = filter.getAsNullableString('site_id');
        if (siteId != null)
            criteria.push({ site_id: siteId });

        let label = filter.getAsNullableString('label');
        if (label != null)
            criteria.push({ label: label });

        let udi = filter.getAsNullableString('udi');
        if (udi != null) {
            criteria.push({ udi: udi });
        }

        let udis = filter.getAsObject('udis');
        if (_.isString(udis))
            udis = udis.split(',');
        if (_.isArray(udis))
            criteria.push({ udi: { $in: udis } });
*/
        return criteria.length > 0 ? { $and: criteria } : null;
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    /*public getOneByUdi(correlationId: string, udi: string,
        callback: (err: any, item: PostV1) => void): void {

        let criteria = {
            udi: udi
        };

        this._model.findOne(criteria, (err, item) => {
            item = this.convertFromPublic(item);

            if (item != null) this._logger.trace(correlationId, "Found beacon by %s", udi);
            else this._logger.trace(correlationId, "Cannot find beacon by %s", udi);

            callback(err, item);
        });
    }*/
}