import mongoose from "mongoose";
import { Model } from "pwoli";

const orgSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
    },
    { collection: 'Organization', timestamps: true }
);

class Organization extends (Model as any) {

}
orgSchema.loadClass(Organization);
orgSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret, _options) {
      ret.id = ret._id;
  }
});
const OrgModel = mongoose.model('Organization', orgSchema)
export default OrgModel;