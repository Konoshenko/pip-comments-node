import { JsonFilePersister } from 'pip-services3-data-node';

import { PostV1 } from '../data/v1/PostV1';
import { PostsMemoryPersistence } from './PostsMemoryPersistence';
import { ConfigParams } from 'pip-services3-commons-node';

export class PostsFilePersistence extends PostsMemoryPersistence {
    protected _persister: JsonFilePersister<PostV1>;

    constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<PostV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams) {
        super.configure(config);
        this._persister.configure(config);
    }
    
}