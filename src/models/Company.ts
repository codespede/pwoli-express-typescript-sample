import { DataTypes } from 'sequelize';
import { Model } from 'pwoli';
import sequelize from '.';
export default class Company extends Model{
    
}

const attributes = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: null,
    primaryKey: true,
    autoIncrement: true,
    comment: null,
    field: "id",
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "title",
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: "1",
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "status",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "description",
    sdfdf:'sdfsdf',
    validate: {
      length(value) {
        // console.log(value);
        if (value.length > 350)
          throw new Error('Only 350 characters are allowed');
      }
    }
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "phone",
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "email",
  },
  website: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "website",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "createdAt",
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
    primaryKey: false,
    autoIncrement: false,
    comment: null,
    field: "updatedAt",
  },
};

const options = {
  tableName: "Company",
  comment: "ss",
  sequelize,
  hooks: {}
};
console.log('company', Model)
Company.init(attributes, options);
