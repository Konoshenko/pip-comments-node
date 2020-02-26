import { CommandableHttpService } from 'pip-services3-rpc-node';
import { Descriptor } from 'pip-services3-commons-node';

export class PostsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/posts');
        this._dependencyResolver.put('controller', new Descriptor('posts', 'controller', '*', '*', '1.0'));
    }
}