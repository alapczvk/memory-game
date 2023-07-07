import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    debug: process.env.NODE_ENV !== 'production'
});

export default {
    USE_REQUEST_LOGGER: true,

    PORT: process.env.PORT || 3000,
    ORIGIN: process.env.ORIGIN?.split(';') || ['http://localhost:3000'],

    STATIC_FILES_DIR: path.resolve(process.env.NODE_ENV === 'production' ?
        '/app/public/' : '..\\client\\build\\'),
};
