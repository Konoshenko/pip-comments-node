import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class PostV1Schema extends ObjectSchema {
    
    public constructor()
    {
        super();

        this.withRequiredProperty('id', TypeCode.String);
        this.withRequiredProperty('author_id', TypeCode.String);
        this.withRequiredProperty('status', TypeCode.String);
        this.withRequiredProperty('create_time', TypeCode.String);
        this.withOptionalProperty('update_time', TypeCode.String);
        this.withRequiredProperty('content_text', TypeCode.String);
        this.withRequiredProperty('attachment_ids', TypeCode.Array);
        this.withRequiredProperty('comment_count', TypeCode.Integer);
        this.withRequiredProperty('view_count', TypeCode.Integer);
        this.withRequiredProperty('repost_count', TypeCode.Integer);
        this.withRequiredProperty('report_count', TypeCode.Integer);
        this.withRequiredProperty('like_count', TypeCode.Integer);
      
    }
}