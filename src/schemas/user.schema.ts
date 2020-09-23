import { model, Model, Schema, Document } from "mongoose";
import { User } from "../models";

export interface UserModel extends User, Document { }

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        default: 0
    },
    organization: {
        type: String,
        required: true,
        default: 0
    },
});

export const UserSchema: Model<UserModel> =
    model<UserModel>("User", userSchema);
