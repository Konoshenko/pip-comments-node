import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { PostsMemoryPersistence } from '../../src/persistence/PostsMemoryPersistence';
import { PostsFilePersistence } from '../../src/persistence/PostsFilePersistence';
import { PostsMongoDbPersistence } from '../../src/persistence/PostsMongoDbPersistence';
import { PostsController } from '../../src/logic/PostsController';
import { PostsHttpServiceV1 } from '../../src/services/v1/PostsHttpServiceV1';

export class PostsServiceFactory extends Factory{
    public static MemoryPersistenceDescriptor = new Descriptor('posts', 'persistence', 'memory', '*', '1.0');
    public static FilePersistenceDescriptor = new Descriptor('posts', 'persistence', 'file', '*', '1.0');
    public static MongoDbPersistenceDescriptor = new Descriptor('posts', 'persistence', 'mongodb', '*', '1.0');
    public static ControllerDescriptor = new Descriptor('posts', 'controller', 'default', '*', '1.0');
    public static HttpServiceV1Descriptor = new Descriptor('posts', 'service', 'http', '*', '1.0');
    
    constructor(){
        super();

        this.registerAsType(PostsServiceFactory.MemoryPersistenceDescriptor, PostsMemoryPersistence);
        this.registerAsType(PostsServiceFactory.FilePersistenceDescriptor, PostsFilePersistence);
        this.registerAsType(PostsServiceFactory.MongoDbPersistenceDescriptor, PostsMongoDbPersistence);
        this.registerAsType(PostsServiceFactory.ControllerDescriptor, PostsController);
        this.registerAsType(PostsServiceFactory.HttpServiceV1Descriptor, PostsHttpServiceV1);
    }
}