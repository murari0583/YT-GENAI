import multer from 'multer';


const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {     
            cb(null, true);
        }   
        else {          
            cb(new Error('Invalid file type. Only PDF resumes are allowed.'));
        }
    }           
}).fields([     
    { name: 'resume', maxCount: 1 }
]); 

export default upload;