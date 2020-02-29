import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { PostV1 } from '../data/v1/PostV1';

export interface IPostsPersistence {

    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<PostV1>) => void): void;

    getOneById(correlationId: string, id: string,
        callback: (err: any, item: PostV1) => void): void;

    create(correlationId: string, item: PostV1,
        callback: (err: any, item: PostV1) => void): void;

    update(correlationId: string, item: PostV1,
        callback: (err: any, item: PostV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: PostV1) => void): void;
}