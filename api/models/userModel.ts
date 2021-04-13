import { Schema, model, Model, Document } from "mongoose";
import bcrypt from 'bcrypt';

/* 
 User Schema
*/

let UserSchema = new Schema<UserDocument, UserModel>({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    hash_password: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

export interface UserDocument extends Document {
    fullName: string,
    email: string,
    hash_password: string,
    created: Date,
}

interface UserModel extends Model<UserDocument> {}

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
};

// Default export
export default model('User', UserSchema);