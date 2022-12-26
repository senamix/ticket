import mongoose from 'mongoose';
import {Password} from '../extensions/password';

/**
  An interface that describes the properties that are required to create a new User
 */
interface UserAttrs {
  email: string;
  password: string;
}

/**
 * An interface that describes the properties that a User Document has
 */
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

/**
  An interface that describes the properties that a User Model has
 */
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;       //change _id response data to id
        delete ret._id;         //remove _id res to client
        delete ret.password;    //remove password res to client
        delete ret.__v;         //remove __v res to client
      },
    },
  }
);

//before save then run this function
userSchema.pre('save', async function (done) {
  //only run if password is modified
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// is an UserModel type
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
