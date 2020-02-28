import { CommandSet, FilterParams, PagingParams } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';

import { PostV1Schema } from '../data/v1/PostV1Schema';
import { IPostsController } from './IPostsController';
import { PostV1 } from '../data/v1';

export class PostsCommandSet extends CommandSet {
    private _controller: IPostsController;

    
    constructor(controller: IPostsController) {
        super();

        this._controller = controller;

        this.addCommand(this.makeGetPostsCommand());
         this.addCommand(this.makeCreatePostCommand());
         this.addCommand(this.makeDeletePostByIdCommand());
         this.addCommand(this.makeGetPostByAuthorId());
         this.addCommand(this.makeGetPostByIdCommand());
         this.addCommand(this.makeUpdatePostCommand());
         this.addCommand(this.makeAddLikeToPost());
         this.addCommand(this.makeTakeRepostByPostId());
    }

    private makeGetPostsCommand(): ICommand {
        return new Command(
            'get_posts',
            new ObjectSchema(true)
                .withOptionalProperty('filter', new FilterParamsSchema())
                .withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get('filter'));
                let paging = PagingParams.fromValue(args.get('paging'));
                this._controller.getPosts(correlationId, filter, paging, callback);
            }
        );
    }

    private makeGetPostByIdCommand(): ICommand {
        return new Command(
            'get_post_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let postId = args.getAsString('id');
                this._controller.getPostById(correlationId, postId, callback);
            }
        );
    }

    private makeGetPostByAuthorId(): ICommand {
        return new Command(
            'get_post_by_author_id',
            new ObjectSchema(true)
                .withRequiredProperty('author_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let authorId = args.getAsString('author_id');
                this._controller.getPostByAuthor(correlationId, authorId, callback);
            }
        );
    }

    private makeCreatePostCommand(): ICommand {
        return new Command(
            'create_post',
            new ObjectSchema(true)
                .withRequiredProperty('post', new PostV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let post = args.getAsObject('post');
                this._controller.createPost(correlationId, post, callback);
            }
        );
    } 
    
    private makeUpdatePostCommand(): ICommand {
        return new Command(
            'update_post',
            new ObjectSchema(true)
                .withRequiredProperty('post', new PostV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let post = args.getAsObject('post');
                this._controller.updatePost(correlationId, post, callback);
            }
        );
    }   

    private makeDeletePostByIdCommand(): ICommand {
        return new Command(
            'delete_post_by_id',
            new ObjectSchema(true)
                .withRequiredProperty('post_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let postId = args.getAsString('post_id');
                this._controller.deletePostById(correlationId, postId, callback);
            }
        );
    }

    private makeAddLikeToPost(): ICommand {
        return new Command(
            'add_like_to_post',
            new ObjectSchema(true)
                .withRequiredProperty('post_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let siteId = args.getAsString('post_id');
                this._controller.addLikeToPost(correlationId, siteId, callback);
            }
        );
    }

    private makeTakeRepostByPostId(): ICommand {
        return new Command(
            'take_repost',
            new ObjectSchema(true)
                .withRequiredProperty('post_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let siteId = args.getAsString('post_id');
                this._controller.takeRepostByPostId(correlationId, siteId, callback);
            }
        );
    }

     

    
    
    

}