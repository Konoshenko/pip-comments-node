import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import {PostsServiceFactory} from '../build/PostsServiceFactory';

export class PostsProcess extends ProcessContainer{
    public constructor(){
        super('posts', 'Posts microservice');

        this._factories.add(new PostsServiceFactory());
        this._factories.add(new DefaultRpcFactory());
    }
}