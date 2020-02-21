import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class CommentV1Schema extends ObjectSchema {
    
    public constructor()
    {
        super();

        this.withRequiredProperty('id', TypeCode.String);
        this.withRequiredProperty('post_id', TypeCode.String);
        this.withRequiredProperty('user_id', TypeCode.String);
        this.withRequiredProperty('type', TypeCode.String);
        this.withRequiredProperty('date', TypeCode.String);
        this.withRequiredProperty('label', TypeCode.String);
        this.withOptionalProperty('report_count', TypeCode.Integer);
        this.withOptionalProperty('like_count', TypeCode.Integer);
    }
}