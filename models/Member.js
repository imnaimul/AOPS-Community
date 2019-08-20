const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Name is required'],
        validate: {
            validator: function(name) {
                let names = name.split(' ');
                return names.length >= 2;
            },
            message: 'Full name must contain firstname and lastname.'
        }
    },
    role: {
        type: String,
        require: [true, 'Member role is required']
    },
    email: {
        type: String,
        require: [true, 'Email is required'],
        validate: [validator.isEmail, 'Email is not valid.']
    },
    photo: {
        type: String,
        default: '/img/uploads/avatar.jpg'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    password: {
        type: String,
        require: [true, 'Password is required'],
        validate: {
            validator: function( val ) {
                return val.length >= 8;
            },
            message: 'A valid password contains at least 8 charecters.'
        }
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: [validator.isMobilePhone, 'Phone number is not valid.']
    },
    token: {
        type: String,
        default: null
    },
    noticePermissions: {
        type: Object,
        default: {
            createUpdateDeleteSelf: false,
            updateDeleteOthers: false
        }
    },
    achievementPermissions: {
        type: Object,
        default: {
            createUpdateDeleteSelf: false,
            updateDeleteOthers: false
        }
    }
});

/*
    noticePermissions: {
        
    }
*/


memberSchema.pre('save', function(next) {
    const user = this;    
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = mongoose.model('Member', memberSchema);
