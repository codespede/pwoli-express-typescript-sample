import { DataTypes } from "sequelize";
import { Model } from "pwoli";
import sequelize from './index.js';
export default class Event extends (Model as any) {
    attributeLabels = {
        title: 'Title',
    };
}

const eventAttributes = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: null,
        field: 'id',
    },
    title: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null,
        primaryKey: false,
        autoIncrement: false,
        comment: null,
        field: 'title',
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
    }
};
const eventOptions = {
    tableName: 'event',
    comment: 'ss',
    sequelize,
    hooks: {},
    freezeTableName: true
};
Event.init(eventAttributes, eventOptions);
