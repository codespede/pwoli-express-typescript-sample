import mongoose from "mongoose";
import { Model } from "pwoli";

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        contactPerson: {
            name: { type: String, required: true },
            email: { type: String, required: true, validate: [function(email) {
                var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return re.test(email)
            }, 'Please fill a valid email address'] },
            phone: { type: Number, required: true },
        },
        companies: [{
            title: { type: String, required: true },
        }],
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization'
        }
    },
    { collection: 'Event', timestamps: true }
);

class Event extends (Model as any) {
    getAttributeLabels() {
        return {
            title: 'Tiddtle',
            'contactPerson.name': 'Contact Person\'s Name',
            organization: 'Organization'
        }
    }
    get getter() {
        return (async () => {
            return this.title + 'getter';
        })();
    }
    get companiesCS() {
        return this.companies?.[0]?.title;
    }
    sampleFunc() {
        return this.id + Math.random();
    }
}

eventSchema.loadClass(Event);
eventSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret, _options) {
      ret.id = ret._id;
  }
});
const EventModel = mongoose.model('Event', eventSchema)
export default EventModel;