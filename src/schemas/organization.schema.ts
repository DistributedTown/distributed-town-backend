import { model, Model, Schema, Document } from "mongoose";
import { Organization } from "../models";

export interface OrganizationModel extends Organization, Document { }

const organizationSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        default: 0
    },
    scarcityScore: {
        type: Number,
        required: true,
        default: 0
    }
});

export const OrganizationSchema: Model<OrganizationModel> =
    model<OrganizationModel>("Organization", organizationSchema);
