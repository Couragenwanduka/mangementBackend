import { Schema, model } from 'mongoose';
import { UserType } from '../interface/user';

const UserSchema = new Schema<UserType>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
    },
    status: {
      type: String,
      enum:['Active', 'Resigned', 'LayedOff', 'Fired'],
      default:'Active'
    },
    picture:{
      type:String,
    }
  },
  {
    timestamps: true,
  }
);

const User = model<UserType>('User', UserSchema);

export default User;
